import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { CreateEventBody, CreateGroupBody, DashboardSummary, Event, GetPopularGroups200, GetPopularGroupsParams, GetRecentMembers200, GetRecentMembersParams, GetUpcomingEvents200, GetUpcomingEventsParams, Group, GroupMembership, HealthStatus, JoinGroupBody, ListCities200, ListEventAttendees200, ListEventCategories200, ListEvents200, ListEventsParams, ListGroupMembers200, ListGroups200, ListGroupsParams, ListMembers200, ListMembersParams, Member, Rsvp, RsvpBody } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List events with optional filters
 */
export declare const getListEventsUrl: (params?: ListEventsParams) => string;
export declare const listEvents: (params?: ListEventsParams, options?: RequestInit) => Promise<ListEvents200>;
export declare const getListEventsQueryKey: (params?: ListEventsParams) => readonly ["/api/events", ...ListEventsParams[]];
export declare const getListEventsQueryOptions: <TData = Awaited<ReturnType<typeof listEvents>>, TError = ErrorType<unknown>>(params?: ListEventsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEvents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEventsQueryResult = NonNullable<Awaited<ReturnType<typeof listEvents>>>;
export type ListEventsQueryError = ErrorType<unknown>;
/**
 * @summary List events with optional filters
 */
export declare function useListEvents<TData = Awaited<ReturnType<typeof listEvents>>, TError = ErrorType<unknown>>(params?: ListEventsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new event
 */
export declare const getCreateEventUrl: () => string;
export declare const createEvent: (createEventBody: CreateEventBody, options?: RequestInit) => Promise<Event>;
export declare const getCreateEventMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEvent>>, TError, {
        data: BodyType<CreateEventBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createEvent>>, TError, {
    data: BodyType<CreateEventBody>;
}, TContext>;
export type CreateEventMutationResult = NonNullable<Awaited<ReturnType<typeof createEvent>>>;
export type CreateEventMutationBody = BodyType<CreateEventBody>;
export type CreateEventMutationError = ErrorType<unknown>;
/**
 * @summary Create a new event
 */
export declare const useCreateEvent: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEvent>>, TError, {
        data: BodyType<CreateEventBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createEvent>>, TError, {
    data: BodyType<CreateEventBody>;
}, TContext>;
/**
 * @summary Get event details
 */
export declare const getGetEventUrl: (eventId: number) => string;
export declare const getEvent: (eventId: number, options?: RequestInit) => Promise<Event>;
export declare const getGetEventQueryKey: (eventId: number) => readonly [`/api/events/${number}`];
export declare const getGetEventQueryOptions: <TData = Awaited<ReturnType<typeof getEvent>>, TError = ErrorType<void>>(eventId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEvent>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getEvent>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetEventQueryResult = NonNullable<Awaited<ReturnType<typeof getEvent>>>;
export type GetEventQueryError = ErrorType<void>;
/**
 * @summary Get event details
 */
export declare function useGetEvent<TData = Awaited<ReturnType<typeof getEvent>>, TError = ErrorType<void>>(eventId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEvent>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary RSVP to an event
 */
export declare const getRsvpEventUrl: (eventId: number) => string;
export declare const rsvpEvent: (eventId: number, rsvpBody: RsvpBody, options?: RequestInit) => Promise<Rsvp>;
export declare const getRsvpEventMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rsvpEvent>>, TError, {
        eventId: number;
        data: BodyType<RsvpBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof rsvpEvent>>, TError, {
    eventId: number;
    data: BodyType<RsvpBody>;
}, TContext>;
export type RsvpEventMutationResult = NonNullable<Awaited<ReturnType<typeof rsvpEvent>>>;
export type RsvpEventMutationBody = BodyType<RsvpBody>;
export type RsvpEventMutationError = ErrorType<unknown>;
/**
 * @summary RSVP to an event
 */
export declare const useRsvpEvent: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rsvpEvent>>, TError, {
        eventId: number;
        data: BodyType<RsvpBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof rsvpEvent>>, TError, {
    eventId: number;
    data: BodyType<RsvpBody>;
}, TContext>;
/**
 * @summary List attendees of an event
 */
export declare const getListEventAttendeesUrl: (eventId: number) => string;
export declare const listEventAttendees: (eventId: number, options?: RequestInit) => Promise<ListEventAttendees200>;
export declare const getListEventAttendeesQueryKey: (eventId: number) => readonly [`/api/events/${number}/attendees`];
export declare const getListEventAttendeesQueryOptions: <TData = Awaited<ReturnType<typeof listEventAttendees>>, TError = ErrorType<unknown>>(eventId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEventAttendees>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEventAttendees>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEventAttendeesQueryResult = NonNullable<Awaited<ReturnType<typeof listEventAttendees>>>;
export type ListEventAttendeesQueryError = ErrorType<unknown>;
/**
 * @summary List attendees of an event
 */
export declare function useListEventAttendees<TData = Awaited<ReturnType<typeof listEventAttendees>>, TError = ErrorType<unknown>>(eventId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEventAttendees>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List groups
 */
export declare const getListGroupsUrl: (params?: ListGroupsParams) => string;
export declare const listGroups: (params?: ListGroupsParams, options?: RequestInit) => Promise<ListGroups200>;
export declare const getListGroupsQueryKey: (params?: ListGroupsParams) => readonly ["/api/groups", ...ListGroupsParams[]];
export declare const getListGroupsQueryOptions: <TData = Awaited<ReturnType<typeof listGroups>>, TError = ErrorType<unknown>>(params?: ListGroupsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGroups>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGroups>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGroupsQueryResult = NonNullable<Awaited<ReturnType<typeof listGroups>>>;
export type ListGroupsQueryError = ErrorType<unknown>;
/**
 * @summary List groups
 */
export declare function useListGroups<TData = Awaited<ReturnType<typeof listGroups>>, TError = ErrorType<unknown>>(params?: ListGroupsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGroups>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new group
 */
export declare const getCreateGroupUrl: () => string;
export declare const createGroup: (createGroupBody: CreateGroupBody, options?: RequestInit) => Promise<Group>;
export declare const getCreateGroupMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGroup>>, TError, {
        data: BodyType<CreateGroupBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGroup>>, TError, {
    data: BodyType<CreateGroupBody>;
}, TContext>;
export type CreateGroupMutationResult = NonNullable<Awaited<ReturnType<typeof createGroup>>>;
export type CreateGroupMutationBody = BodyType<CreateGroupBody>;
export type CreateGroupMutationError = ErrorType<unknown>;
/**
 * @summary Create a new group
 */
export declare const useCreateGroup: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGroup>>, TError, {
        data: BodyType<CreateGroupBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGroup>>, TError, {
    data: BodyType<CreateGroupBody>;
}, TContext>;
/**
 * @summary Get group details
 */
export declare const getGetGroupUrl: (groupId: number) => string;
export declare const getGroup: (groupId: number, options?: RequestInit) => Promise<Group>;
export declare const getGetGroupQueryKey: (groupId: number) => readonly [`/api/groups/${number}`];
export declare const getGetGroupQueryOptions: <TData = Awaited<ReturnType<typeof getGroup>>, TError = ErrorType<void>>(groupId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGroup>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGroup>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGroupQueryResult = NonNullable<Awaited<ReturnType<typeof getGroup>>>;
export type GetGroupQueryError = ErrorType<void>;
/**
 * @summary Get group details
 */
export declare function useGetGroup<TData = Awaited<ReturnType<typeof getGroup>>, TError = ErrorType<void>>(groupId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGroup>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Join a group
 */
export declare const getJoinGroupUrl: (groupId: number) => string;
export declare const joinGroup: (groupId: number, joinGroupBody: JoinGroupBody, options?: RequestInit) => Promise<GroupMembership>;
export declare const getJoinGroupMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinGroup>>, TError, {
        groupId: number;
        data: BodyType<JoinGroupBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof joinGroup>>, TError, {
    groupId: number;
    data: BodyType<JoinGroupBody>;
}, TContext>;
export type JoinGroupMutationResult = NonNullable<Awaited<ReturnType<typeof joinGroup>>>;
export type JoinGroupMutationBody = BodyType<JoinGroupBody>;
export type JoinGroupMutationError = ErrorType<unknown>;
/**
 * @summary Join a group
 */
export declare const useJoinGroup: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinGroup>>, TError, {
        groupId: number;
        data: BodyType<JoinGroupBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof joinGroup>>, TError, {
    groupId: number;
    data: BodyType<JoinGroupBody>;
}, TContext>;
/**
 * @summary List members of a group
 */
export declare const getListGroupMembersUrl: (groupId: number) => string;
export declare const listGroupMembers: (groupId: number, options?: RequestInit) => Promise<ListGroupMembers200>;
export declare const getListGroupMembersQueryKey: (groupId: number) => readonly [`/api/groups/${number}/members`];
export declare const getListGroupMembersQueryOptions: <TData = Awaited<ReturnType<typeof listGroupMembers>>, TError = ErrorType<unknown>>(groupId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGroupMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGroupMembers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGroupMembersQueryResult = NonNullable<Awaited<ReturnType<typeof listGroupMembers>>>;
export type ListGroupMembersQueryError = ErrorType<unknown>;
/**
 * @summary List members of a group
 */
export declare function useListGroupMembers<TData = Awaited<ReturnType<typeof listGroupMembers>>, TError = ErrorType<unknown>>(groupId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGroupMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List community members
 */
export declare const getListMembersUrl: (params?: ListMembersParams) => string;
export declare const listMembers: (params?: ListMembersParams, options?: RequestInit) => Promise<ListMembers200>;
export declare const getListMembersQueryKey: (params?: ListMembersParams) => readonly ["/api/members", ...ListMembersParams[]];
export declare const getListMembersQueryOptions: <TData = Awaited<ReturnType<typeof listMembers>>, TError = ErrorType<unknown>>(params?: ListMembersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMembers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMembersQueryResult = NonNullable<Awaited<ReturnType<typeof listMembers>>>;
export type ListMembersQueryError = ErrorType<unknown>;
/**
 * @summary List community members
 */
export declare function useListMembers<TData = Awaited<ReturnType<typeof listMembers>>, TError = ErrorType<unknown>>(params?: ListMembersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get member profile
 */
export declare const getGetMemberUrl: (memberId: number) => string;
export declare const getMember: (memberId: number, options?: RequestInit) => Promise<Member>;
export declare const getGetMemberQueryKey: (memberId: number) => readonly [`/api/members/${number}`];
export declare const getGetMemberQueryOptions: <TData = Awaited<ReturnType<typeof getMember>>, TError = ErrorType<void>>(memberId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMember>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMember>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMemberQueryResult = NonNullable<Awaited<ReturnType<typeof getMember>>>;
export type GetMemberQueryError = ErrorType<void>;
/**
 * @summary Get member profile
 */
export declare function useGetMember<TData = Awaited<ReturnType<typeof getMember>>, TError = ErrorType<void>>(memberId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMember>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard summary stats
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary stats
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get upcoming events for dashboard
 */
export declare const getGetUpcomingEventsUrl: (params?: GetUpcomingEventsParams) => string;
export declare const getUpcomingEvents: (params?: GetUpcomingEventsParams, options?: RequestInit) => Promise<GetUpcomingEvents200>;
export declare const getGetUpcomingEventsQueryKey: (params?: GetUpcomingEventsParams) => readonly ["/api/dashboard/upcoming-events", ...GetUpcomingEventsParams[]];
export declare const getGetUpcomingEventsQueryOptions: <TData = Awaited<ReturnType<typeof getUpcomingEvents>>, TError = ErrorType<unknown>>(params?: GetUpcomingEventsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUpcomingEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUpcomingEvents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUpcomingEventsQueryResult = NonNullable<Awaited<ReturnType<typeof getUpcomingEvents>>>;
export type GetUpcomingEventsQueryError = ErrorType<unknown>;
/**
 * @summary Get upcoming events for dashboard
 */
export declare function useGetUpcomingEvents<TData = Awaited<ReturnType<typeof getUpcomingEvents>>, TError = ErrorType<unknown>>(params?: GetUpcomingEventsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUpcomingEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get most popular groups
 */
export declare const getGetPopularGroupsUrl: (params?: GetPopularGroupsParams) => string;
export declare const getPopularGroups: (params?: GetPopularGroupsParams, options?: RequestInit) => Promise<GetPopularGroups200>;
export declare const getGetPopularGroupsQueryKey: (params?: GetPopularGroupsParams) => readonly ["/api/dashboard/popular-groups", ...GetPopularGroupsParams[]];
export declare const getGetPopularGroupsQueryOptions: <TData = Awaited<ReturnType<typeof getPopularGroups>>, TError = ErrorType<unknown>>(params?: GetPopularGroupsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPopularGroups>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPopularGroups>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPopularGroupsQueryResult = NonNullable<Awaited<ReturnType<typeof getPopularGroups>>>;
export type GetPopularGroupsQueryError = ErrorType<unknown>;
/**
 * @summary Get most popular groups
 */
export declare function useGetPopularGroups<TData = Awaited<ReturnType<typeof getPopularGroups>>, TError = ErrorType<unknown>>(params?: GetPopularGroupsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPopularGroups>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recently joined members
 */
export declare const getGetRecentMembersUrl: (params?: GetRecentMembersParams) => string;
export declare const getRecentMembers: (params?: GetRecentMembersParams, options?: RequestInit) => Promise<GetRecentMembers200>;
export declare const getGetRecentMembersQueryKey: (params?: GetRecentMembersParams) => readonly ["/api/dashboard/recent-members", ...GetRecentMembersParams[]];
export declare const getGetRecentMembersQueryOptions: <TData = Awaited<ReturnType<typeof getRecentMembers>>, TError = ErrorType<unknown>>(params?: GetRecentMembersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentMembers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentMembersQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentMembers>>>;
export type GetRecentMembersQueryError = ErrorType<unknown>;
/**
 * @summary Get recently joined members
 */
export declare function useGetRecentMembers<TData = Awaited<ReturnType<typeof getRecentMembers>>, TError = ErrorType<unknown>>(params?: GetRecentMembersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get event categories with counts
 */
export declare const getListEventCategoriesUrl: () => string;
export declare const listEventCategories: (options?: RequestInit) => Promise<ListEventCategories200>;
export declare const getListEventCategoriesQueryKey: () => readonly ["/api/events/categories"];
export declare const getListEventCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listEventCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEventCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEventCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEventCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listEventCategories>>>;
export type ListEventCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary Get event categories with counts
 */
export declare function useListEventCategories<TData = Awaited<ReturnType<typeof listEventCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEventCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get available cities with member counts
 */
export declare const getListCitiesUrl: () => string;
export declare const listCities: (options?: RequestInit) => Promise<ListCities200>;
export declare const getListCitiesQueryKey: () => readonly ["/api/cities"];
export declare const getListCitiesQueryOptions: <TData = Awaited<ReturnType<typeof listCities>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCities>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCitiesQueryResult = NonNullable<Awaited<ReturnType<typeof listCities>>>;
export type ListCitiesQueryError = ErrorType<unknown>;
/**
 * @summary Get available cities with member counts
 */
export declare function useListCities<TData = Awaited<ReturnType<typeof listCities>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map