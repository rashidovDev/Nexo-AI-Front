import React from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useForm } from 'react-hook-form'
import z from 'zod'
import { otpSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/services/use-auth'

const Verify  = () => {
  const {email} = useAuthStore()
   const form = useForm<z.infer<typeof otpSchema>>({
          resolver : zodResolver(otpSchema),
          defaultValues: {
              email,
              otp: ''
          }
      })
  
      function onSubmit(values: z.infer<typeof otpSchema>) {
          console.log(values)
      }
  return (
    <div className='w-full max-w-md mx-auto'>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <FormControl>
                <Input disabled placeholder="Please enter your email" className='h-10 bg-secondary ' {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <Label>One-Time Password</Label>
              <FormControl>
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS} className='w-full'>
                  <InputOTPGroup className='w-full'>
                    <InputOTPSlot index={0}  className='w-full'/>
                    <InputOTPSlot index={1}  className='w-full'/>
                    <InputOTPSlot index={2}  className='w-full'/>
                   
                  </InputOTPGroup>

                  <InputOTPSeparator/>

                   <InputOTPGroup className='w-full'>
                    
                    <InputOTPSlot index={3} className='w-full' />
                    <InputOTPSlot index={4} className='w-full' />
                    <InputOTPSlot index={5} className='w-full' />
                  </InputOTPGroup>
                  </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' size={"lg"} type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default Verify 