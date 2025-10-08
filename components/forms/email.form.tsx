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

const EmailForm = () => {

  const [verify, setVerify] = useState(false)

    const emailform = useForm<z.infer<typeof oldEmailSchema>>({
        resolver : zodResolver(oldEmailSchema),
        defaultValues: {
            email : '',
            oldEmail : 'anvarrashidov17@gmail.com'
        }
    })

    const otpForm = useForm<z.infer<typeof otpSchema>>({
      resolver : zodResolver(otpSchema),
      defaultValues: {
          otp : '',
          email : ''
      }
  })

    const onEmailSubmit = (values : z.infer<typeof emailSchema>) => {
        console.log(values)
        otpForm.setValue('email', values.email)
        setVerify(true)
    }

    const onOtpSubmit = (data : z.infer<typeof otpSchema>) => {
      console.log(data)
  }

  return verify ? (
<Form {...otpForm}>
			<form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className='space-y-2'>
				<Label>New email</Label>
				<Input className='h-10 bg-secondary' disabled value={otpForm.watch('email')} />
				<FormField
					control={otpForm.control}
					name='otp'
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
							<FormMessage className='text-xs text-red-500' />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full' disabled>
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
  )
}

export default EmailForm