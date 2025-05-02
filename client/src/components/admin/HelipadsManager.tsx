import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helipad, insertHelipadSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  Pencil,
  Trash2,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Form schema for adding/editing helipads
const formSchema = insertHelipadSchema.extend({
  pricePerHour: z.coerce.number().min(1, "Price must be at least 1"),
});

type FormData = z.infer<typeof formSchema>;

export default function HelipadsManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentHelipad, setCurrentHelipad] = useState<Helipad | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch helipads
  const { data: helipads, isLoading } = useQuery<Helipad[]>({
    queryKey: ['/api/admin/helipads'],
  });

  // Form for adding/editing helipads
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      imageUrl: "",
      pricePerHour: 10000,
      latitude: undefined,
      longitude: undefined,
      isActive: true,
    },
  });

  // Reset form when dialog opens/closes
  const resetForm = (helipad?: Helipad) => {
    if (helipad) {
      form.reset({
        name: helipad.name,
        location: helipad.location,
        description: helipad.description || "",
        imageUrl: helipad.imageUrl || "",
        pricePerHour: helipad.pricePerHour / 100, // Convert from paisa to rupees
        latitude: helipad.latitude || undefined,
        longitude: helipad.longitude || undefined,
        isActive: helipad.isActive,
      });
    } else {
      form.reset({
        name: "",
        location: "",
        description: "",
        imageUrl: "",
        pricePerHour: 10000,
        latitude: undefined,
        longitude: undefined,
        isActive: true,
      });
    }
  };

  // Add helipad mutation
  const addHelipadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formattedData = {
        ...data,
        pricePerHour: data.pricePerHour * 100, // Convert to paisa
      };
      const res = await apiRequest('POST', '/api/admin/helipads', formattedData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Helipad added",
        description: "The helipad has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/helipads'] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add helipad",
        variant: "destructive",
      });
    },
  });

  // Edit helipad mutation
  const editHelipadMutation = useMutation({
    mutationFn: async (data: FormData & { id: number }) => {
      const { id, ...formData } = data;
      const formattedData = {
        ...formData,
        pricePerHour: formData.pricePerHour * 100, // Convert to paisa
      };
      const res = await apiRequest('PATCH', `/api/admin/helipads/${id}`, formattedData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Helipad updated",
        description: "The helipad has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/helipads'] });
      setIsEditDialogOpen(false);
      setCurrentHelipad(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update helipad",
        variant: "destructive",
      });
    },
  });

  // Delete helipad mutation
  const deleteHelipadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/helipads/${id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Helipad deleted",
        description: "The helipad has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/helipads'] });
      setIsDeleteDialogOpen(false);
      setCurrentHelipad(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete helipad",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for adding
  const onAddSubmit = (data: FormData) => {
    addHelipadMutation.mutate(data);
  };

  // Handle form submission for editing
  const onEditSubmit = (data: FormData) => {
    if (!currentHelipad) return;
    editHelipadMutation.mutate({ ...data, id: currentHelipad.id });
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (!currentHelipad) return;
    deleteHelipadMutation.mutate(currentHelipad.id);
  };

  // Open edit dialog with helipad data
  const handleEdit = (helipad: Helipad) => {
    setCurrentHelipad(helipad);
    resetForm(helipad);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDelete = (helipad: Helipad) => {
    setCurrentHelipad(helipad);
    setIsDeleteDialogOpen(true);
  };

  // Filter helipads based on search term
  const filteredHelipads = helipads?.filter(helipad => 
    helipad.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    helipad.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Helipads Management</h1>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Helipad
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Helipads</CardTitle>
          <CardDescription>Manage helipad locations across Bangalore</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search helipads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price (Per Hour)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHelipads && filteredHelipads.length > 0 ? (
                    filteredHelipads.map((helipad) => (
                      <TableRow key={helipad.id}>
                        <TableCell className="font-medium">{helipad.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-neutral-500" />
                            {helipad.location}
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(helipad.pricePerHour)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            helipad.isActive 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {helipad.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(helipad)}
                            className="mr-2"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(helipad)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                        {searchTerm ? "No helipads matching your search" : "No helipads found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination controls would go here */}
          {filteredHelipads && filteredHelipads.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-4">1</Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Helipad Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Helipad</DialogTitle>
            <DialogDescription>
              Add a new helipad location to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Helipad Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter helipad name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description" 
                        {...field} 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pricePerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Hour (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10000" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 mt-8">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="m-0">Active</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="12.9716" 
                          {...field}
                          onChange={(e) => 
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="77.5946" 
                          {...field}
                          onChange={(e) => 
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addHelipadMutation.isPending}
                >
                  {addHelipadMutation.isPending ? "Adding..." : "Add Helipad"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Helipad Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Helipad</DialogTitle>
            <DialogDescription>
              Edit helipad details.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Helipad Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter helipad name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description" 
                        {...field} 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pricePerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Hour (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10000" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 mt-8">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="m-0">Active</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="12.9716" 
                          {...field}
                          onChange={(e) => 
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="77.5946" 
                          {...field}
                          onChange={(e) => 
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={editHelipadMutation.isPending}
                >
                  {editHelipadMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the helipad
              "{currentHelipad?.name}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteHelipadMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
