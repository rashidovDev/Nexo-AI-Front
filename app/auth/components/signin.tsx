"use client"
import { emailSchema } from '@/lib/validation'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/services/use-auth'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/axios'
import { IError } from '@/types'
import { toast } from '@/hooks/use-toast'

const Signin = () => {
  const {setStep, setEmail} = useAuthStore()

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver : zodResolver(emailSchema),
        defaultValues: {
            email: ''
        }
    })

    const {mutate, isPending} = useMutation(
      {
        mutationFn: async (email : string) => {
          const {data} = await apiClient.post('/user/login', { email })
          console.log(data)
          return data
        },
        onSuccess: (data) => {
          setStep('verify')
          setEmail(data.email)
          toast({ description: data.message })
        },
        onError: (error : IError) => {
          if(error?.response?.data?.message) {
            toast({ description: error.response.data.message, variant: 'destructive' })
      }
      return toast({ description: 'Something went wrong', variant: 'destructive' })
    }
  })

    function onSubmit(values: z.infer<typeof emailSchema>) {
      mutate(values.email)
    }

  return (
    <div className='w-full max-w-md mx-auto'>
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <FormControl>
                <Input disabled={isPending} placeholder="Please enter your email" {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem> 
          )}
        />
        <Button className='w-full' type="submit" disabled={isPending}>Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default Signin