import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import EventsList from "@/pages/events/index";
import EventDetail from "@/pages/events/detail";
import EventNew from "@/pages/events/new";
import GroupsList from "@/pages/groups/index";
import GroupDetail from "@/pages/groups/detail";
import GroupNew from "@/pages/groups/new";
import MembersList from "@/pages/members/index";
import MemberDetail from "@/pages/members/detail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      <Route path="/events" component={EventsList} />
      <Route path="/events/new" component={EventNew} />
      <Route path="/events/:id" component={EventDetail} />
      
      <Route path="/groups" component={GroupsList} />
      <Route path="/groups/new" component={GroupNew} />
      <Route path="/groups/:id" component={GroupDetail} />
      
      <Route path="/members" component={MembersList} />
      <Route path="/members/:id" component={MemberDetail} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
