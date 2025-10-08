"use client"
import DangerZoneForm from '@/components/forms/danger.zone'
import EmailForm from '@/components/forms/email.form'
import InformationForm from '@/components/forms/information.form'
import NotificationForm from '@/components/forms/notification.form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { LogIn, Moon, Sun, VolumeOff } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'

const Settings = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <div className='px-3'>

     <div className='flex items-center mb-5 cursor-pointer' onClick={() => setIsProfileOpen(true)}>
      <Avatar className='w-14 h-14'>
							<AvatarImage  className='object-cover' />
							<AvatarFallback className='text-xl uppercase font-spaceGrotesk'>A</AvatarFallback>
						</Avatar>
            <div className='ml-3'>
          <h1 className='text-md font-spaceGrotesk font-semibold'>Anvar Rashidov</h1>
          <p className='text-sm text-muted-foreground'>anvarrashidov17@gmail.com</p>
            </div>
     </div>


     <div className='flex justify-between items-center p-2 hover:bg-secondary rounded-md  my-2'>
       <div className='flex items-center gap-1'>
         <VolumeOff size={16}/>
         <span className='text-sm'>Mute</span>
       </div>
       <Switch/>
     </div>

     <div className='flex justify-between items-center p-2 hover:bg-secondary rounded-md my-2'>
							<div className='flex items-center gap-1'>
								{resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
								<span className='text-sm'>{resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
							</div>
							<Switch
								checked={resolvedTheme === 'dark' ? true : false}
								onCheckedChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
							/>
						</div>

     <div className='flex justify-between items-center bg-destructive p-2 cursor-pointer rounded-md my-2' >
							<div className='flex items-center gap-1'>
								<LogIn size={16} />
								<span className='text-sm'>Logout</span>
							</div>
						</div>

        <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
				<SheetContent side={'left'} className='w-80 p-2 max-md:w-full'>
					<SheetHeader>
						<SheetTitle className='text-2xl'>My profile</SheetTitle>
						<SheetDescription>
							Setting up your profile will help you connect with your friends and family easily.
						</SheetDescription>
					</SheetHeader>

					<Separator className='my-2' />

					<div className='mx-auto w-1/2 max-md:w-1/4 h-36 relative'>
						<Avatar className='w-full h-36'>
							<AvatarImage  className='object-cover' />
							<AvatarFallback className='text-6xl uppercase font-spaceGrotesk'>
    
							</AvatarFallback>
						</Avatar>
						{/* <UploadButton
							endpoint='imageUploader'
							onClientUploadComplete={res => {
							mutate({ avatar: res[0].url })
							}}
							config={{ appendOnPaste: true, mode: 'auto' }}
							className='absolute right-0 bottom-0'
							appearance={{ allowedContent: { display: 'none' }, button: { width: 40, height: 40, borderRadius: '100%' } }}
							content={{ button: <Upload size={16} /> }}
						/> */}
					</div>
          <Accordion type='single' collapsible className='mt-4'>
						<AccordionItem value='item-1'>
							<AccordionTrigger className='bg-secondary px-2'>Basic information</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<InformationForm />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='item-2' className='mt-2'>
							<AccordionTrigger className='bg-secondary px-2'>Email</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<EmailForm />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='item-3' className='mt-2'>
							<AccordionTrigger className='bg-secondary px-2'>Notification</AccordionTrigger>
							<AccordionContent className='mt-2'>
								<NotificationForm />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='item-4' className='mt-2'>
							<AccordionTrigger className='bg-secondary px-2'>Danger zone</AccordionTrigger>
							<AccordionContent className='my-2 px-2'>
								<DangerZoneForm />
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					
				</SheetContent> 
			</Sheet>



    </div>
  )
}

export default Settings