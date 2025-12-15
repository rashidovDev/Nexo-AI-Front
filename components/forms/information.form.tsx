"use client"

import React, { FC, useEffect, useState } from 'react'
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
import { apiClient } from '@/services/api/axios'
import { toast } from '@/hooks/use-toast'
import { IError } from '@/types'
import { generateToken } from '@/lib/generate-token'
import { set } from 'mongoose'

interface InformationFormProps {
 setOpenItem: (item: string) => void
}

const InformationForm : FC  <InformationFormProps> = ({setOpenItem}) => {

  const {data : session, update} =  useSession()

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof profileSchema>) => {
      const token = await generateToken(session?.currentUser)
    
      const { data } = await apiClient.put('/user/edit-profile', payload, { headers: { Authorization: `Bearer ${token}` } })
      
      return data
    },
    onSuccess: () => {
      update()
      toast({ description: 'Profile updated successfully' })
      setOpenItem?.("") // ✅ closes the accordion
    },
  })

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver : zodResolver(profileSchema),
        defaultValues: {
            username : session?.currentUser?.username || '',
            firstName: session?.currentUser?.firstName,
            lastName: session?.currentUser?.lastName,
            bio: session?.currentUser?.bio || '',
       
        }
    })


  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(false);

    const username = form.watch("username");

     useEffect(() => {
          if (!username || username === session?.currentUser?.username) {
      setIsAvailable(null);
      return;
    }
    if (!username) {
      setIsAvailable(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      checkUsername(username);
    }, 1500);
    // setIsAvailable(false)
    // setIsChecking(false)

    return () => clearTimeout(delayDebounce);
  }, [username]);

    async function checkUsername(value: string) {
    setIsChecking(true);
    try {
      const available = await apiClient(`/user/check-username?username=${encodeURIComponent(value)}`);
    
       console.log("Username availability:", available.data);
      if (available.data) {
        setIsAvailable(true);
        form.clearErrors("username");
      } else {
        setIsAvailable(false);
        form.setError("username", { message: "Username already taken" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  }

    const onSubmit = (data : z.infer<typeof profileSchema>) => {
      console.log('Submitting data:', data)
        mutate(data)
    }
  return (
   
    <>
    
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <Label>Username</Label>
              <FormControl>
                <Input 
                 placeholder="Please enter your username"  disabled={isChecking} {...field} />
              </FormControl> 
               {/* Show feedback messages */}
              {isChecking && (
                <p className="text-gray-500 text-sm mt-1">Checking availability...</p>
              )}
              {isAvailable === true && (
                <p className="text-green-600 text-sm mt-1">✅ Username available!</p>
              )}
              {/* {isAvailable === false && (
                <p className="text-red-600 text-sm mt-1">❌ Username already taken.</p>
              )} */}
              <FormMessage />
            </FormItem> 
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <Label>First Name</Label>
              <FormControl>
                <Input placeholder="Please enter your firstname" disabled={isPending} {...field} />
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
                <Input placeholder="Please enter your lastname" disabled={isPending} {...field} />
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
                <Textarea placeholder="Bio" disabled={isPending} {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem> 
          )}
        />

        <Button  className='w-full' type="submit">Edit</Button>
      </form>
    </Form>
    </>
   
  )
}

export default InformationForm