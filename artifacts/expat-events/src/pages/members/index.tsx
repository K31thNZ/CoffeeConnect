import { useListMembers, useListCities } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPin, Search, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MembersList() {
  const [city, setCity] = useState<string>("all");
  
  const { data: membersData, isLoading } = useListMembers({
    city: city !== "all" ? city : undefined,
  });
  
  const { data: citiesData } = useListCities();

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground">Community Members</h1>
        <p className="text-muted-foreground mt-2 text-lg">Connect with internationally-minded people in your city</p>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col sm:flex-row gap-4 mb-12 max-w-3xl">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search members by name or interests..." className="pl-9 bg-muted/50 border-none h-12" />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full sm:w-[250px] h-12 bg-muted/50 border-none">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {citiesData?.cities?.map(c => (
              <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          Array(10).fill(0).map((_, i) => <Skeleton key={i} className="h-[280px] rounded-2xl" />)
        ) : membersData?.members?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No members found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters.</p>
            <Button variant="outline" onClick={() => setCity('all')}>Clear Filters</Button>
          </div>
        ) : (
          membersData?.members?.map((member) => (
            <Link key={member.id} href={`/members/${member.id}`}>
              <Card className="h-full hover-scale group cursor-pointer border-transparent shadow-sm bg-card hover:shadow-md transition-all text-center">
                <CardContent className="p-6 flex flex-col items-center h-full">
                  <Avatar className="w-24 h-24 mb-4 ring-4 ring-background shadow-sm">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 mb-1">{member.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-3 h-3"/> {member.city}
                  </div>
                  
                  {member.interests && member.interests.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                      {member.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-medium">
                          {interest}
                        </span>
                      ))}
                      {member.interests.length > 3 && (
                        <span className="bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-medium">
                          +{member.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
