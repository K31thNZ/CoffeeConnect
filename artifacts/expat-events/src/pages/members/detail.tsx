import { useGetMember } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { format } from "date-fns";
import { MapPin, Globe, Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const memberId = parseInt(id, 10);

  const { data: member, isLoading } = useGetMember(memberId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center mb-12">
          <Skeleton className="w-32 h-32 rounded-full mb-4" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!member) return <div className="container mx-auto px-4 py-20 text-center">Member not found</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[200px] bg-primary/5 blur-3xl rounded-full -z-10" />
        
        <Avatar className="w-32 h-32 mb-6 ring-4 ring-background shadow-lg">
          <AvatarImage src={member.avatarUrl} alt={member.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <h1 className="text-4xl font-serif font-bold text-foreground mb-3">{member.name}</h1>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground font-medium mb-6">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary" /> {member.city}</span>
          {member.nationality && <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-secondary" /> {member.nationality}</span>}
          <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> Joined {format(new Date(member.joinedAt), "MMM yyyy")}</span>
        </div>

        {member.interests && member.interests.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {member.interests.map((interest, idx) => (
              <span key={idx} className="bg-muted px-3 py-1 rounded-full text-sm font-medium text-foreground">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="rounded-3xl shadow-sm border border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 font-serif">About Me</h2>
              {member.bio ? (
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {member.bio}
                </div>
              ) : (
                <p className="text-muted-foreground italic">This member hasn't written a bio yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
           <Card className="rounded-3xl shadow-sm border border-border/50 bg-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="text-primary w-5 h-5"/> Hometown</h3>
              <p className="text-muted-foreground">{member.nationality || "Unknown"}</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl shadow-sm border border-border/50 bg-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="text-secondary w-5 h-5"/> Current City</h3>
              <p className="text-muted-foreground">{member.city}</p>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
