import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { profileSchema } from '@/lib/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

const InformationForm = () => {

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver : zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            bio: ''
        }
    })

    const onSubmit = (data : z.infer<typeof profileSchema>) => {
        console.log(data)
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <Label>First Name</Label>
              <FormControl>
                <Input placeholder="Please enter your email" {...field} />
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
              <Label>Last Name</Label>
              <FormControl>
                <Input placeholder="Please enter your email" {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem> 
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <Label>Bio</Label>
              <FormControl>
                <Textarea placeholder="Please enter your email" {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem> 
          )}
        />

        <Button className='w-full' type="submit">Edit</Button>
      </form>
    </Form>
  )
}

export default InformationForm