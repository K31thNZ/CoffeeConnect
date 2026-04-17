import { Router, type IRouter } from "express";
import { eq, sql, desc, and, ilike } from "drizzle-orm";
import { db, groupsTable, membersTable, groupMembershipsTable } from "@workspace/db";
import {
  ListGroupsQueryParams,
  CreateGroupBody,
  GetGroupParams,
  JoinGroupParams,
  JoinGroupBody,
  ListGroupMembersParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/groups", async (req, res): Promise<void> => {
  const parsed = ListGroupsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { city, category, limit = 20, offset = 0 } = parsed.data;
  const conditions = [];

  if (city) conditions.push(ilike(groupsTable.city, city));
  if (category) conditions.push(ilike(groupsTable.category, category));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [groups, countResult] = await Promise.all([
    db
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
      .where(where)
      .orderBy(desc(groupsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(groupsTable)
      .where(where),
  ]);

  res.json({ groups, total: countResult[0]?.count ?? 0 });
});

router.post("/groups", async (req, res): Promise<void> => {
  const parsed = CreateGroupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [group] = await db.insert(groupsTable).values(parsed.data).returning();

  res.status(201).json({ ...group, memberCount: 0 });
});

router.get("/groups/:groupId", async (req, res): Promise<void> => {
  const parsed = GetGroupParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [group] = await db
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
    .where(eq(groupsTable.id, parsed.data.groupId));

  if (!group) {
    res.status(404).json({ error: "Group not found" });
    return;
  }

  res.json(group);
});

router.post("/groups/:groupId/join", async (req, res): Promise<void> => {
  const params = JoinGroupParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = JoinGroupBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(groupMembershipsTable)
    .where(
      and(
        eq(groupMembershipsTable.groupId, params.data.groupId),
        eq(groupMembershipsTable.memberId, body.data.memberId)
      )
    );

  if (existing.length > 0) {
    res.json(existing[0]);
    return;
  }

  const [membership] = await db
    .insert(groupMembershipsTable)
    .values({
      groupId: params.data.groupId,
      memberId: body.data.memberId,
    })
    .returning();

  res.json(membership);
});

router.get("/groups/:groupId/members", async (req, res): Promise<void> => {
  const params = ListGroupMembersParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const members = await db
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
    .from(groupMembershipsTable)
    .innerJoin(membersTable, eq(groupMembershipsTable.memberId, membersTable.id))
    .where(eq(groupMembershipsTable.groupId, params.data.groupId));

  res.json({ members, total: members.length });
});

export default router;
