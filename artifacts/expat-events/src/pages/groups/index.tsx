import { useListGroups, useListCities, useListEventCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Users, MapPin, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function GroupsList() {
  const [city, setCity] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  
  const { data: groupsData, isLoading } = useListGroups({
    city: city !== "all" ? city : undefined,
    category: category !== "all" ? category : undefined,
  });
  
  const { data: citiesData } = useListCities();
  const { data: categoriesData } = useListEventCategories();

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Groups</h1>
          <p className="text-muted-foreground mt-2 text-lg">Find communities that share your passions</p>
        </div>
        <Link href="/groups/new">
          <Button className="rounded-full px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md shadow-secondary/20">
            Start a Group
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col sm:flex-row gap-4 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search groups..." className="pl-9 bg-muted/50 border-none h-12" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-[220px] rounded-2xl" />)
        ) : groupsData?.groups?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or be the first to start a group!</p>
            <Button variant="outline" onClick={() => { setCity('all'); setCategory('all'); }}>Clear Filters</Button>
          </div>
        ) : (
          groupsData?.groups?.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <Card className="h-full hover-scale group cursor-pointer border-transparent shadow-sm bg-card hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-muted shrink-0 overflow-hidden shadow-sm">
                      {group.imageUrl ? (
                        <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary">
                          <Users className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-xl group-hover:text-secondary transition-colors line-clamp-2 leading-tight">{group.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3"/> {group.city}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-grow mb-4 leading-relaxed">{group.description}</p>
                  <div className="mt-auto flex items-center justify-between text-sm font-medium pt-4 border-t border-border/50">
                    <span className="flex items-center gap-1.5 text-secondary"><Users className="w-4 h-4"/> {group.memberCount} members</span>
                    <span className="text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md text-xs">{group.category}</span>
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
