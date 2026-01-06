"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  service: z.string().min(1, {
    message: "Please select a service.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      service: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // In a real app, you would handle submission here.
    alert("Form submitted! Check console for values.")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 font-satoshi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Full name"
                    {...field}
                    className="h-[48px] px-4 rounded-lg border-primary bg-transparent placeholder:text-[#FFB3B3] text-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
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
                <FormControl>
                  <Input
                    placeholder="Phone number"
                    {...field}
                    className="h-[48px] px-4 rounded-lg border-primary bg-transparent placeholder:text-[#FFB3B3] text-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email Address"
                  {...field}
                  className="h-[48px] px-4 rounded-lg border-primary bg-transparent placeholder:text-[#FFB3B3] text-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-[48px] px-4 rounded-lg border-primary bg-transparent text-[#FFB3B3] data-placeholder:text-[#FFB3B3] focus:ring-1 focus:ring-primary focus:ring-offset-0 icon-primary">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="bg-background border-primary text-primary rounded-lg">
                  <SelectItem value="animation" className="focus:bg-[#FFEBEB] focus:text-primary cursor-pointer">3D Animation</SelectItem>
                  <SelectItem value="film" className="focus:bg-[#FFEBEB] focus:text-primary cursor-pointer">Film Production</SelectItem>
                  <SelectItem value="archviz" className="focus:bg-[#FFEBEB] focus:text-primary cursor-pointer">Architectural Visualization</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Give a brief description of your project"
                  {...field}
                  className="min-h-[120px] p-4 rounded-lg border-primary bg-transparent placeholder:text-[#FFB3B3] text-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-[120px] h-[48px] bg-primary text-white rounded-lg font-satoshi font-medium text-lg hover:opacity-90 uppercase"
        >
          SUBMIT
        </Button>
      </form>
    </Form>
  )
}
