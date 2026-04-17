import { useGetGroup, useListGroupMembers, useJoinGroup, getGetGroupQueryKey, getListGroupMembersQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Users, MapPin, Calendar as CalendarIcon, Info, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const groupId = parseInt(id, 10);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: group, isLoading: loadingGroup } = useGetGroup(groupId);
  const { data: membersData, isLoading: loadingMembers } = useListGroupMembers(groupId);
  
  const joinMutation = useJoinGroup({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGroupQueryKey(groupId) });
        queryClient.invalidateQueries({ queryKey: getListGroupMembersQueryKey(groupId) });
        toast({ title: "Successfully joined the group!" });
      }
    }
  });

  const handleJoin = () => {
    joinMutation.mutate({ groupId, data: { memberId: 1 } }); // Hardcoded memberId for demo
  };

  // For demo, let's pretend memberId 1 is already in the group if we have members
  const isMember = membersData?.members?.some(m => m.id === 1);

  if (loadingGroup) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-[300px] rounded-3xl mb-8" />
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

  if (!group) return <div className="container mx-auto px-4 py-20 text-center">Group not found</div>;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="w-full bg-muted border-b relative">
        <div className="h-[250px] md:h-[350px] w-full relative overflow-hidden">
          {group.imageUrl ? (
            <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
              <Users className="w-24 h-24 text-secondary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">{group.category}</span>
                <span className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {group.city}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">{group.name}</h1>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  <span className="font-medium text-foreground">{group.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  <span>Created {format(new Date(group.createdAt), "MMM yyyy")}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-serif"><Info className="text-secondary w-6 h-6"/> About this group</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {group.description}
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 font-serif"><Users className="text-secondary w-6 h-6"/> Members ({group.memberCount})</h2>
              </div>
              
              {loadingMembers ? (
                <div className="flex gap-4"><Skeleton className="w-12 h-12 rounded-full"/><Skeleton className="w-12 h-12 rounded-full"/></div>
              ) : membersData?.members?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {membersData.members.map(member => (
                    <Link key={member.id} href={`/members/${member.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                        <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback className="bg-secondary/10 text-secondary font-bold">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate group-hover:text-secondary transition-colors">{member.name}</p>
                          {member.nationality && <p className="text-xs text-muted-foreground truncate">{member.nationality}</p>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No members yet. Be the first to join!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:-mt-12">
            <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/50 sticky top-24">
              <div className="text-center space-y-4 mb-6">
                <h3 className="font-bold text-xl">Ready to dive in?</h3>
                <p className="text-muted-foreground text-sm">Join the group to connect with members and get notified about upcoming events.</p>
              </div>

              {isMember ? (
                <Button 
                  className="w-full bg-muted text-foreground rounded-xl h-12 text-lg cursor-default" 
                  disabled
                >
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> You're a member
                </Button>
              ) : (
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-xl h-12 text-lg shadow-sm" 
                  onClick={handleJoin}
                  disabled={joinMutation.isPending}
                >
                  <UserPlus className="w-5 h-5 mr-2" /> {joinMutation.isPending ? "Joining..." : "Join Group"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
