import { Router, type IRouter } from "express";
import { eq, sql, desc, gte, and, ilike } from "drizzle-orm";
import { db, eventsTable, membersTable, rsvpsTable } from "@workspace/db";
import {
  ListEventsQueryParams,
  CreateEventBody,
  GetEventParams,
  RsvpEventParams,
  RsvpEventBody,
  ListEventAttendeesParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/events/categories", async (_req, res): Promise<void> => {
  const results = await db
    .select({
      category: eventsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(eventsTable)
    .groupBy(eventsTable.category)
    .orderBy(desc(sql`count(*)`));

  res.json({ categories: results });
});

router.get("/events", async (req, res): Promise<void> => {
  const parsed = ListEventsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { city, category, upcoming, limit = 20, offset = 0 } = parsed.data;
  const conditions = [];

  if (city) conditions.push(ilike(eventsTable.city, city));
  if (category) conditions.push(ilike(eventsTable.category, category));
  if (upcoming) conditions.push(gte(eventsTable.date, new Date()));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [events, countResult] = await Promise.all([
    db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        description: eventsTable.description,
        date: eventsTable.date,
        endDate: eventsTable.endDate,
        city: eventsTable.city,
        venue: eventsTable.venue,
        address: eventsTable.address,
        category: eventsTable.category,
        imageUrl: eventsTable.imageUrl,
        hostId: eventsTable.hostId,
        hostName: membersTable.name,
        maxAttendees: eventsTable.maxAttendees,
        isFree: eventsTable.isFree,
        price: eventsTable.price,
        createdAt: eventsTable.createdAt,
        attendeeCount: sql<number>`(SELECT count(*)::int FROM rsvps WHERE rsvps.event_id = ${eventsTable.id} AND rsvps.status = 'going')`,
      })
      .from(eventsTable)
      .leftJoin(membersTable, eq(eventsTable.hostId, membersTable.id))
      .where(where)
      .orderBy(desc(eventsTable.date))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(eventsTable)
      .where(where),
  ]);

  res.json({ events, total: countResult[0]?.count ?? 0 });
});

router.post("/events", async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [event] = await db.insert(eventsTable).values({
    title: parsed.data.title,
    description: parsed.data.description,
    date: new Date(parsed.data.date),
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    city: parsed.data.city,
    venue: parsed.data.venue,
    address: parsed.data.address,
    category: parsed.data.category,
    imageUrl: parsed.data.imageUrl,
    maxAttendees: parsed.data.maxAttendees,
    isFree: parsed.data.isFree,
    price: parsed.data.price != null ? String(parsed.data.price) : null,
    hostId: 1,
  }).returning();

  const host = await db
    .select({ name: membersTable.name })
    .from(membersTable)
    .where(eq(membersTable.id, event.hostId));

  res.status(201).json({
    ...event,
    hostName: host[0]?.name ?? "Unknown",
    attendeeCount: 0,
  });
});

router.get("/events/:eventId", async (req, res): Promise<void> => {
  const parsed = GetEventParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [event] = await db
    .select({
      id: eventsTable.id,
      title: eventsTable.title,
      description: eventsTable.description,
      date: eventsTable.date,
      endDate: eventsTable.endDate,
      city: eventsTable.city,
      venue: eventsTable.venue,
      address: eventsTable.address,
      category: eventsTable.category,
      imageUrl: eventsTable.imageUrl,
      hostId: eventsTable.hostId,
      hostName: membersTable.name,
      maxAttendees: eventsTable.maxAttendees,
      isFree: eventsTable.isFree,
      price: eventsTable.price,
      createdAt: eventsTable.createdAt,
      attendeeCount: sql<number>`(SELECT count(*)::int FROM rsvps WHERE rsvps.event_id = ${eventsTable.id} AND rsvps.status = 'going')`,
    })
    .from(eventsTable)
    .leftJoin(membersTable, eq(eventsTable.hostId, membersTable.id))
    .where(eq(eventsTable.id, parsed.data.eventId));

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json(event);
});

router.post("/events/:eventId/rsvp", async (req, res): Promise<void> => {
  const params = RsvpEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = RsvpEventBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(rsvpsTable)
    .where(
      and(
        eq(rsvpsTable.eventId, params.data.eventId),
        eq(rsvpsTable.memberId, body.data.memberId)
      )
    );

  let rsvp;
  if (existing.length > 0) {
    [rsvp] = await db
      .update(rsvpsTable)
      .set({ status: body.data.status })
      .where(eq(rsvpsTable.id, existing[0].id))
      .returning();
  } else {
    [rsvp] = await db
      .insert(rsvpsTable)
      .values({
        eventId: params.data.eventId,
        memberId: body.data.memberId,
        status: body.data.status,
      })
      .returning();
  }

  res.json(rsvp);
});

router.get("/events/:eventId/attendees", async (req, res): Promise<void> => {
  const params = ListEventAttendeesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const attendees = await db
    .select({
      id: membersTable.id,
      name: membersTable.name,
      email: membersTable.email,
      avatarUrl: membersTable.avatarUrl,
      bio: membersTable.bio,
      city: membersTable.city,
      nationality: membersTable.nationality,
      interests: membersTable.interests,
      joinedAt: membersTable.joinedAt,
    })
    .from(rsvpsTable)
    .innerJoin(membersTable, eq(rsvpsTable.memberId, membersTable.id))
    .where(
      and(
        eq(rsvpsTable.eventId, params.data.eventId),
        eq(rsvpsTable.status, "going")
      )
    );

  res.json({ attendees, total: attendees.length });
});

export default router;
