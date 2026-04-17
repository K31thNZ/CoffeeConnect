import { useCreateGroup } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Image as ImageIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name is too short").max(100),
  description: z.string().min(10, "Description is too short"),
  city: z.string().min(2, "City is required"),
  category: z.string().min(2, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function GroupNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createGroup = useCreateGroup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      city: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createGroup.mutate(
      { data: { ...values, imageUrl: values.imageUrl || undefined } },
      {
        onSuccess: (group) => {
          toast({ title: "Group created successfully!" });
          setLocation(`/groups/${group.id}`);
        },
        onError: () => {
          toast({ title: "Failed to create group", variant: "destructive" });
        }
      }
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground">Start a Group</h1>
        <p className="text-muted-foreground mt-2 text-lg">Create a space for people who share your interests.</p>
      </div>

      <Card className="rounded-3xl shadow-sm border border-border/50">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-6">
                <h3 className="text-xl font-serif font-bold border-b pb-2">Group Details</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lisbon Tech Expats" className="h-12 bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Technology" className="h-12 bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="e.g. Lisbon" className="pl-9 h-12 bg-muted/50" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What is this group about? Who should join?" 
                          className="min-h-[120px] bg-muted/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 pt-6">
                <h3 className="text-xl font-serif font-bold border-b pb-2">Branding</h3>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="https://..." className="pl-9 h-12 bg-muted/50" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white h-14 text-lg"
                  disabled={createGroup.isPending}
                >
                  {createGroup.isPending ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
