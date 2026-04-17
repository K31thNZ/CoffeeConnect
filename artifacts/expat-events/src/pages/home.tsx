import { useGetDashboardSummary, useGetUpcomingEvents, useGetPopularGroups, useGetRecentMembers } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowRight, MapPin, Calendar as CalendarIcon, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: upcomingEvents, isLoading: loadingEvents } = useGetUpcomingEvents({ limit: 3 });
  const { data: popularGroups, isLoading: loadingGroups } = useGetPopularGroups({ limit: 3 });
  const { data: recentMembers, isLoading: loadingMembers } = useGetRecentMembers({ limit: 4 });

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Section */}
      <section className="relative bg-primary/5 pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
              Find your people in a <span className="text-primary italic">new city</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover local events, join interest-based groups, and connect with internationally-minded friends who understand the journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                  Explore Events
                </Button>
              </Link>
              <Link href="/groups" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 text-primary">
                  Browse Groups
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Cities", value: summary?.citiesCount, icon: MapPin, loading: loadingSummary },
            { label: "Events", value: summary?.totalEvents, icon: CalendarIcon, loading: loadingSummary },
            { label: "Groups", value: summary?.totalGroups, icon: Users, loading: loadingSummary },
            { label: "Members", value: summary?.totalMembers, icon: UserPlus, loading: loadingSummary },
          ].map((stat, i) => (
            <Card key={i} className="glass-card border-none shadow-sm animate-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.loading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <span className="text-3xl font-serif font-bold text-foreground">{stat.value || 0}</span>
                )}
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 mt-24 space-y-24">
        {/* Upcoming Events */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">What's happening around you soon</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-primary hover:text-primary/80 hidden sm:flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingEvents ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[300px] rounded-xl" />)
            ) : upcomingEvents?.events?.map((event, i) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="h-full overflow-hidden hover-scale group cursor-pointer border-transparent shadow-sm hover:shadow-md transition-all">
                  <div className="h-48 bg-muted relative overflow-hidden">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20">
                        <CalendarIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-background/95 backdrop-blur text-foreground px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                      {format(new Date(event.date), "MMM d")}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 font-medium">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{event.category}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {event.city}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{event.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Groups */}
        <section className="bg-secondary/5 rounded-3xl p-8 md:p-12 -mx-4 sm:mx-0">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Groups</h2>
              <p className="text-muted-foreground">Find your tribe</p>
            </div>
            <Link href="/groups">
              <Button variant="ghost" className="text-secondary hover:text-secondary/80 hidden sm:flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingGroups ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[200px] rounded-xl" />)
            ) : popularGroups?.groups?.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <Card className="h-full hover-scale group cursor-pointer border-transparent shadow-sm bg-background">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-muted shrink-0 overflow-hidden shadow-sm">
                        {group.imageUrl ? (
                          <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-secondary transition-colors line-clamp-2 leading-tight">{group.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3"/> {group.city}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{group.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm font-medium">
                      <span className="text-secondary">{group.memberCount} members</span>
                      <span className="text-muted-foreground bg-muted px-2 py-1 rounded-md text-xs">{group.category}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
