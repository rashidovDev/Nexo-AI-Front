"use client"

import React, { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FaTelegram, FaUser } from 'react-icons/fa'
import { contactSchema, emailSchema } from '@/lib/validation'
import z from 'zod'
import { UseFormReturn } from 'react-hook-form'
import { LuMessagesSquare } from 'react-icons/lu'
import { UserPlus } from 'lucide-react';


interface Props {
	contactForm: UseFormReturn<z.infer<typeof contactSchema>>
	onCreateContact: (values: z.infer<typeof contactSchema>) => void
}

const AddContact : FC<Props>= ({contactForm, onCreateContact}) => {
	const [formIsVisible, setFormIsVisible] = React.useState<boolean>(false);
  return (
   <div className='h-screen w-full flex z-40 relative'>
			<div className='flex justify-center items-center z-50 w-full'>
				<div className='flex flex-col items-center gap-4'>
					<div className='container max-w-md w-full  flex 
    justify-center items-center flex-col space-y-1'>
       
        <LuMessagesSquare size={80} className='text-primary mx-auto'/>
        <div className='text-4xl font-bold'><h1>Nexo AI </h1> </div>
        <p className='text-center text-muted-foreground text-sm'>
            An AI-powered chat app that goes beyond conversations — your personal assistant for work, life, and everything in between
        </p>
           </div>
		   {!formIsVisible && (
             <Button onClick={() => setFormIsVisible(true)} type='submit' className='w-full' size={'lg'}>
						<UserPlus size={16}/> Add Contact
			</Button>
		   )}
		   
					{/* FORM */}
					{
						formIsVisible && (
                        <Form {...contactForm}>
						<form onSubmit={contactForm.handleSubmit(onCreateContact)} className='space-y-2 w-full'>
							<FormField
								control={contactForm.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<Label>Email</Label>
										<FormControl>
											<Input placeholder='info@sammi.ac'  className='h-10 bg-secondary' {...field} />
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
									
								)}
							/>
							<FormField
								control={contactForm.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<Label>Name</Label>
										<FormControl>
											<Input placeholder='John Doe'  className='h-10 bg-secondary' {...field} />
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
									
								)}
							/>
							<Button type='submit' className='w-full' size={'lg'}>
								Submit
							</Button>
						</form>
					</Form>
						)
					}
					
				</div>
			</div>
		</div>
  )
}

export default AddContact