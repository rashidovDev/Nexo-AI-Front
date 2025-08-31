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

const Signin = () => {
  const {setStep, setEmail} = useAuthStore()
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver : zodResolver(emailSchema),
        defaultValues: {
            email: ''
        }
    })

    function onSubmit(values: z.infer<typeof emailSchema>) {
      // API CALL
     setStep('verify')
     setEmail(values.email)
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
                <Input placeholder="Please enter your email" {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem> 
          )}
        />
        <Button className='w-full' type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default Signin