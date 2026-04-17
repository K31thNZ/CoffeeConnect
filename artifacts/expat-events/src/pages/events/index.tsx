import { useListEvents, useListCities, useListEventCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Search, Filter, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function EventsList() {
  const [city, setCity] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  
  const { data: eventsData, isLoading } = useListEvents({
    city: city !== "all" ? city : undefined,
    category: category !== "all" ? category : undefined,
    upcoming: true
  });
  
  const { data: citiesData } = useListCities();
  const { data: categoriesData } = useListEventCategories();

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-2 text-lg">Discover what's happening around you</p>
        </div>
        <Link href="/events/new">
          <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">
            Host an Event
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col sm:flex-row gap-4 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-9 bg-muted/50 border-none h-12" />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full sm:w-[200px] h-12 bg-muted/50 border-none">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {citiesData?.cities?.map(c => (
              <SelectItem key={c.city} value={c.city}>{c.city} ({c.eventCount})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[200px] h-12 bg-muted/50 border-none">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData?.categories?.map(c => (
              <SelectItem key={c.category} value={c.category}>{c.category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-[380px] rounded-2xl" />)
        ) : eventsData?.events?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or be the first to host an event!</p>
            <Button variant="outline" onClick={() => { setCity('all'); setCategory('all'); }}>Clear Filters</Button>
          </div>
        ) : (
          eventsData?.events?.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="h-full overflow-hidden hover-scale group cursor-pointer border-transparent shadow-sm hover:shadow-md transition-all bg-card">
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
                  {event.isFree && (
                    <div className="absolute top-4 right-4 bg-green-500/90 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                      FREE
                    </div>
                  )}
                </div>
                <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 font-medium">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{event.category}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {event.city}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {event.attendeeCount} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''}
                    </div>
                    {!event.isFree && event.price && (
                      <div className="font-bold text-foreground">${event.price}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
