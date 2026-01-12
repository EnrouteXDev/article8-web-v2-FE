"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  address: z.string().min(5, "Address is required"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      country: "",
      state: "",
      address: "",
    },
  });

  const onSubmit = (values: CheckoutValues) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Title with decorative line */}
      <div className="flex flex-col gap-4">
        <h2 className="font-baloo font-medium text-2xl text-primary relative inline-block">
          Shipping Progress
          <span className="absolute -bottom-1 left-0 w-24 h-0.5 bg-primary" />
        </h2>
        <div className="w-full h-px bg-primary/10" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <label className="text-primary font-satoshi text-sm font-medium mb-1.5 block">
                    First Name
                  </label>
                  <FormControl>
                    <Input
                      placeholder="Busola"
                      {...field}
                      className="h-[56px] px-4 rounded-lg border-primary bg-white text-primary placeholder:text-primary/30 focus-visible:ring-1 focus-visible:ring-primary"
                    />
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
                  <label className="text-primary font-satoshi text-sm font-medium mb-1.5 block">
                    Last Name
                  </label>
                  <FormControl>
                    <Input
                      placeholder="Ronke"
                      {...field}
                      className="h-[56px] px-4 rounded-lg border-primary bg-white text-primary placeholder:text-primary/30 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <label className="text-primary font-satoshi text-sm font-medium mb-1.5 block">
                    Email
                  </label>
                  <FormControl>
                    <Input
                      placeholder="Busolaronke@gmail.com"
                      {...field}
                      className="h-[56px] px-4 rounded-lg border-primary bg-white text-primary placeholder:text-primary/30 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <label className="text-primary font-satoshi text-sm font-medium mb-1.5 block">
                    Phone Number
                  </label>
                  <FormControl>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 flex items-center gap-1 text-primary/60 text-sm font-medium pointer-events-none">
                        <span>+234</span>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mx-2 text-primary/20">|</span>
                      </div>
                      <Input
                        placeholder="08173397806"
                        {...field}
                        className="h-[56px] pl-24 pr-4 rounded-lg border-primary bg-white text-primary placeholder:text-primary/30 focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <label className="text-primary font-satoshi text-sm font-medium mb-1.5 block">
                    Country
                  </label>
                  <FormControl>
                    <Input
                      placeholder="Nigeria"
                      {...field}
                      className="h-[56px] px-4 rounded-lg border-primary bg-white text-primary placeholder:text-primary/30 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <label className="text-primary font-satoshi text-sm font-medium mb-1.5 block">
                    State
                  </label>
                  <FormControl>
                    <Input
                      placeholder="Lagos"
                      {...field}
                      className="h-[56px] px-4 rounded-lg border-primary bg-white text-primary placeholder:text-primary/30 focus-visible:ring-1 focus-visible:ring-primary"
                    />
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
                <label className="text-primary font-satoshi text-sm font-medium mb-1.5 block">
                  Your Address
                </label>
                <FormControl>
                  <Input
                    placeholder="372 Kola Lateef jakande, Lagos"
                    {...field}
                    className="h-[56px] px-4 rounded-lg border-primary bg-white text-primary placeholder:text-primary/30 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="w-full h-[64px] bg-primary text-white rounded-[8px] font-satoshi font-bold text-xl hover:bg-primary/90 transition-colors mt-8"
          >
            Complete Order
          </button>
        </form>
      </Form>
    </div>
  );
}
