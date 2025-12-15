import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Form,
  FormControl,

  FormDescription,

  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { emailSchema, oldEmailSchema, otpSchema, profileSchema } from '@/lib/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { signOut, useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
import { generateToken } from '@/lib/generate-token'
import { apiClient } from '@/services/api/axios'
import { toast } from '@/hooks/use-toast'

const EmailForm = () => {

  const [verify, setVerify] = useState(false)
  const {data : session, update} =  useSession()

    const emailform = useForm<z.infer<typeof oldEmailSchema>>({
        resolver : zodResolver(oldEmailSchema),
        defaultValues: {
            email : '',
            oldEmail :  session?.currentUser?.email || '',
        }
    })

    const otpForm = useForm<z.infer<typeof otpSchema>>({
      resolver : zodResolver(otpSchema),
      defaultValues: {
          otp : '',
          email :  '',
      }
  })
const otpMutation = useMutation({
  mutationFn: async (email: string) => {
    const token = await generateToken(session?.currentUser);
    const { data } = await apiClient.post<{ email: string }>(
      '/user/send-otp',
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  onSuccess: ({ email }) => {
    toast({ description: 'OTP sent to your email' });
    otpForm.setValue('email', email);
    setVerify(true);
  },
});


   function onEmailSubmit(values: z.infer<typeof oldEmailSchema>) {
		otpMutation.mutate(values.email)
	}

  const verifyMutation = useMutation({
		mutationFn: async (otp: string) => {
			const token = await generateToken(session?.currentUser)
			const { data } = await apiClient.put(
				'/user/change-email',
				{ email: otpForm.getValues('email'), otp },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
      console.log('Change email response data:', data)
			return data
		},
		onSuccess: () => {
			toast({ description: 'Email updated successfully' })
			signOut()
		},
	})

   function onVerifySubmit(values: z.infer<typeof otpSchema>) {
		verifyMutation.mutate(values.otp)
	}

  return verify ? ( 
<Form {...otpForm}> 
			<form onSubmit={otpForm.handleSubmit(onVerifySubmit)} className='space-y-2'>
				<Label>New email</Label>
				<Input className='h-10 bg-secondary' disabled value={otpForm.watch('email') || ''} />
				<FormField
					control={otpForm.control}
					name='otp'
					render={({ field }) => (
						<FormItem>
							<Label>One-Time Password</Label>
							<FormControl>
								 <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS} 
                 disabled={verifyMutation.isPending} className='w-full'>
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
							<FormMessage className='text-xs text-red-500' />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full' disabled={verifyMutation.isPending}>
					Submit
				</Button>
			</form>
		</Form>
    ) :   (
    <Form {...emailform}>
      <form onSubmit={emailform.handleSubmit(onEmailSubmit)} className="space-y-2">
        <FormField
          control={emailform.control}
          name="oldEmail"
          render={({ field }) => (
            <FormItem>
              <Label>Current Email</Label>
              <FormControl>
                <Input disabled placeholder="Please enter your email" {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem> 
          )}
        />

         <FormField
          control={emailform.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>New Email</Label>
              <FormControl>
                <Input placeholder="Please enter your email" {...field} />
              </FormControl> 
              <FormMessage />
            </FormItem> 
          )}
        />
        <Button className='w-full' type="submit" disabled={otpMutation.isPending}>Submit</Button>
      </form>
    </Form>
  )
}

export default EmailForm