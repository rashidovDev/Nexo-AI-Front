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
import { useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/axios'
import { toast } from '@/hooks/use-toast'
import { IError } from '@/types'
import { generateToken } from '@/lib/generate-token'

const InformationForm = () => {

  const {data : session, update} =  useSession()

  const {mutate, isPending} = useMutation(
      {
        mutationFn: async () => {
          const token = await generateToken(session?.currentUser)
          console.log(token)
          // const {data} = await apiClient.post('/user/login', { email })
          // console.log(data)
          // return data
        },
        onSuccess: (data) => {
          // toast({ description: data.message })
          update()
        },
        onError: (error : IError) => {
          if(error?.response?.data?.message) {
            toast({ description: error.response.data.message, variant: 'destructive' })
      }
      return toast({ description: 'Something went wrong', variant: 'destructive' })
    }
  })

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
        mutate()
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
                <Input placeholder="Please enter your email" disabled={isPending} {...field} />
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
                <Input placeholder="Please enter your email" disabled={isPending} {...field} />
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
                <Textarea placeholder="Please enter your email" disabled={isPending} {...field} />
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