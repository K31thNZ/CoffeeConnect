import { useGetEvent, useListEventAttendees, useRsvpEvent, getGetEventQueryKey, getListEventAttendeesQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Users, Clock, Info, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { RsvpBodyStatus } from "@workspace/api-client-react/src/generated/api.schemas";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id, 10);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: event, isLoading: loadingEvent } = useGetEvent(eventId);
  const { data: attendeesData, isLoading: loadingAttendees } = useListEventAttendees(eventId);
  
  const rsvpMutation = useRsvpEvent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) });
        queryClient.invalidateQueries({ queryKey: getListEventAttendeesQueryKey(eventId) });
        toast({ title: "RSVP updated successfully" });
      }
    }
  });

  const handleRsvp = (status: RsvpBodyStatus) => {
    rsvpMutation.mutate({ eventId, data: { memberId: 1, status } }); // Hardcoding memberId 1 for demo
  };

  if (loadingEvent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-[400px] rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full mt-8" />
          </div>
          <div><Skeleton className="h-64 w-full" /></div>
        </div>
      </div>
    );
  }

  if (!event) return <div className="container mx-auto px-4 py-20 text-center">Event not found</div>;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="w-full bg-muted border-b relative">
        <div className="h-[300px] md:h-[450px] w-full relative overflow-hidden">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <CalendarIcon className="w-24 h-24 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">{event.category}</span>
                {event.isFree && <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">Free</span>}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">{event.title}</h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mt-6">
                <Link href={`/members/${event.hostId}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary">{event.hostName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">Hosted by {event.hostName}</span>
                </Link>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-serif"><Info className="text-primary w-6 h-6"/> About this event</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 font-serif"><Users className="text-primary w-6 h-6"/> Attendees ({event.attendeeCount})</h2>
                {event.maxAttendees && <span className="text-muted-foreground text-sm font-medium">{event.maxAttendees - event.attendeeCount} spots left</span>}
              </div>
              
              {loadingAttendees ? (
                <div className="flex gap-4"><Skeleton className="w-12 h-12 rounded-full"/><Skeleton className="w-12 h-12 rounded-full"/></div>
              ) : attendeesData?.attendees?.length ? (
                <div className="flex flex-wrap gap-4">
                  {attendeesData.attendees.map(attendee => (
                    <Link key={attendee.id} href={`/members/${attendee.id}`}>
                      <Avatar className="w-12 h-12 ring-2 ring-background shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                        <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No one has RSVP'd yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:-mt-12">
            <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/50 sticky top-24">
              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary mt-1 shrink-0"><CalendarIcon className="w-6 h-6" /></div>
                  <div>
                    <div className="font-bold text-foreground text-lg">{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</div>
                    <div className="text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-4 h-4"/> {format(new Date(event.date), "h:mm a")}</div>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-secondary/10 p-3 rounded-2xl text-secondary mt-1 shrink-0"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <div className="font-bold text-foreground text-lg">{event.venue}</div>
                    <div className="text-muted-foreground mt-1 leading-snug">{event.address || event.city}</div>
                  </div>
                </div>
                
                {!event.isFree && event.price && (
                  <div className="flex gap-4 items-center">
                    <div className="bg-muted p-3 rounded-2xl text-foreground font-bold text-xl shrink-0">${event.price}</div>
                    <div className="text-muted-foreground font-medium">Per person</div>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">Are you going?</h3>
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-lg shadow-sm" 
                    onClick={() => handleRsvp('going')}
                    disabled={rsvpMutation.isPending}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Yes, I'm going
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl"
                      onClick={() => handleRsvp('interested')}
                      disabled={rsvpMutation.isPending}
                    >
                      <HelpCircle className="w-4 h-4 mr-2" /> Interested
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRsvp('not_going')}
                      disabled={rsvpMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Not going
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
