import { z } from "zod/v4";
export declare const groupMembershipsTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "group_memberships";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "group_memberships";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        groupId: import("drizzle-orm/pg-core").PgColumn<{
            name: "group_id";
            tableName: "group_memberships";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        memberId: import("drizzle-orm/pg-core").PgColumn<{
            name: "member_id";
            tableName: "group_memberships";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        joinedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "joined_at";
            tableName: "group_memberships";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertGroupMembershipSchema: z.ZodObject<{
    memberId: z.ZodInt;
    groupId: z.ZodInt;
}, {
    out: {};
    in: {};
}>;
export type InsertGroupMembership = z.infer<typeof insertGroupMembershipSchema>;
export type GroupMembership = typeof groupMembershipsTable.$inferSelect;
//# sourceMappingURL=groupMemberships.d.ts.map