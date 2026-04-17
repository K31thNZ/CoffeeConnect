import { Router, type IRouter } from "express";
import { eq, sql, desc, and, ilike } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import {
  ListMembersQueryParams,
  GetMemberParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/members", async (req, res): Promise<void> => {
  const parsed = ListMembersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { city, nationality, limit = 20, offset = 0 } = parsed.data;
  const conditions = [];

  if (city) conditions.push(ilike(membersTable.city, city));
  if (nationality) conditions.push(ilike(membersTable.nationality, nationality));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [members, countResult] = await Promise.all([
    db
      .select()
      .from(membersTable)
      .where(where)
      .orderBy(desc(membersTable.joinedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(membersTable)
      .where(where),
  ]);

  res.json({ members, total: countResult[0]?.count ?? 0 });
});

router.get("/members/:memberId", async (req, res): Promise<void> => {
  const parsed = GetMemberParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [member] = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.id, parsed.data.memberId));

  if (!member) {
    res.status(404).json({ error: "Member not found" });
    return;
  }

  res.json(member);
});

export default router;
