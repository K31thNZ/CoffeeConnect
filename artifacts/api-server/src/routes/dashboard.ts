import { Router, type IRouter } from "express";
import { eq, sql, desc, gte } from "drizzle-orm";
import { db, eventsTable, groupsTable, membersTable, groupMembershipsTable, rsvpsTable } from "@workspace/db";
import {
  GetUpcomingEventsQueryParams,
  GetPopularGroupsQueryParams,
  GetRecentMembersQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [eventsCount, groupsCount, membersCount, upcomingCount, citiesResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(eventsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(groupsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(membersTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(eventsTable)
      .where(gte(eventsTable.date, new Date())),
    db
      .select({ count: sql<number>`count(distinct ${membersTable.city})::int` })
      .from(membersTable),
  ]);

  res.json({
    totalEvents: eventsCount[0]?.count ?? 0,
    totalGroups: groupsCount[0]?.count ?? 0,
    totalMembers: membersCount[0]?.count ?? 0,
    upcomingEventsCount: upcomingCount[0]?.count ?? 0,
    citiesCount: citiesResult[0]?.count ?? 0,
  });
});

router.get("/dashboard/upcoming-events", async (req, res): Promise<void> => {
  const parsed = GetUpcomingEventsQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 5) : 5;

  const events = await db
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
    .where(gte(eventsTable.date, new Date()))
    .orderBy(eventsTable.date)
    .limit(limit);

  res.json({ events });
});

router.get("/dashboard/popular-groups", async (req, res): Promise<void> => {
  const parsed = GetPopularGroupsQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 5) : 5;

  const groups = await db
    .select({
      id: groupsTable.id,
      name: groupsTable.name,
      description: groupsTable.description,
      city: groupsTable.city,
      category: groupsTable.category,
      imageUrl: groupsTable.imageUrl,
      createdAt: groupsTable.createdAt,
      memberCount: sql<number>`(SELECT count(*)::int FROM group_memberships WHERE group_memberships.group_id = ${groupsTable.id})`,
    })
    .from(groupsTable)
    .orderBy(desc(sql`(SELECT count(*)::int FROM group_memberships WHERE group_memberships.group_id = ${groupsTable.id})`))
    .limit(limit);

  res.json({ groups });
});

router.get("/dashboard/recent-members", async (req, res): Promise<void> => {
  const parsed = GetRecentMembersQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 8) : 8;

  const members = await db
    .select()
    .from(membersTable)
    .orderBy(desc(membersTable.joinedAt))
    .limit(limit);

  res.json({ members });
});

router.get("/cities", async (_req, res): Promise<void> => {
  const cities = await db
    .select({
      city: membersTable.city,
      memberCount: sql<number>`count(*)::int`,
      eventCount: sql<number>`(SELECT count(*)::int FROM events WHERE events.city = ${membersTable.city})`,
    })
    .from(membersTable)
    .groupBy(membersTable.city)
    .orderBy(desc(sql`count(*)`));

  res.json({ cities });
});

export default router;
