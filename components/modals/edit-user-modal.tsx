"use client";

import * as z from "zod";
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {CalendarIcon, Loader2} from "lucide-react";
import { ModalType, useModal } from "@/hooks/use-modal";
import { useUser } from "@/components/providers/current-user-provider";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
  Popover, PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select, SelectContent,
  SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import {userFormSchema} from "@/forms/user-form";
import axios from "axios";
import {toast} from "sonner";



type UserFormData = z.infer<typeof userFormSchema>;

const EditUserModal = () => {
  const modal = useModal();
  const router = useRouter();
  const { user } = useUser();
  const disableExit = user != null && user.firstName == null;
  const isOpen = modal.isOpen && modal.type === ModalType.EDIT_USER_INFO;
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      birthDate: user?.BirthDate ?? new Date(),
      gender: user?.Gender ?? true,
      city: user?.City ?? "",
      address: user?.Address ?? null,
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    try {
      const response = await axios.post("/api/users", data);

      if (response.status != 200) throw new Error('Failed to update user');
      modal.close();
      if (disableExit) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      toast("Failed to update user", {
        description: `Error: ${error}`,
        action: {
          label: "Retry",
          onClick: () => form.handleSubmit(handleSubmit),
        },
      })
    }
  };

  return (
    <Dialog open={isOpen || disableExit} onOpenChange={(o) => {
      if (!o && !disableExit) modal.close();
      if (o) {
        form.setValue("firstName" , user?.firstName ?? "");
        form.setValue("lastName" , user?.lastName ?? "");
        form.setValue("birthDate" , user?.BirthDate ?? new Date());
        form.setValue("gender" , user?.Gender ?? true);
        form.setValue("city" , user?.City ?? "");
        form.setValue("address" , user?.Address ?? null);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 max-w-50 max-h-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Male</SelectItem>
                        <SelectItem value="false">Female</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="New York" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {form.formState.isSubmitting && <Loader2 className={"w-4 h-4 animate-spin"}/>}
                <span>Save changes</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;