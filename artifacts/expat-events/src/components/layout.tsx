import { Link, useLocation } from "wouter";
import { Globe, Calendar, Users, MapPin, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Globe },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/members", label: "Members", icon: MapPin },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:bg-secondary transition-colors duration-300">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">ExpatEvents</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className="px-1">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/events/new">
              <Button size="sm" className="hidden sm:flex rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sm">
                <Plus className="w-4 h-4 mr-1" />
                Create Event
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card py-12 mt-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-serif text-lg font-bold">ExpatEvents</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your digital town square for discovering events, joining communities, and connecting with internationally-minded people in your new city.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events" className="hover:text-primary transition-colors">Upcoming Events</Link></li>
              <li><Link href="/groups" className="hover:text-primary transition-colors">Local Groups</Link></li>
              <li><Link href="/members" className="hover:text-primary transition-colors">Community Members</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events/new" className="hover:text-primary transition-colors">Host an Event</Link></li>
              <li><Link href="/groups/new" className="hover:text-primary transition-colors">Start a Group</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} ExpatEvents. Welcoming the world.
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-background border-t pb-safe flex justify-around p-2 z-50">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center p-2 text-xs">
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={isActive ? "text-primary font-medium" : "text-muted-foreground"}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
