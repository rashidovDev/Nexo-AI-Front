"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentChatUser } from '@/services/current-chat'
import { Copy, Settings2 } from 'lucide-react'
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from '@/components/ui/separator'
import { set } from 'mongoose'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/services/use-auth'
import { generateToken } from '@/lib/generate-token'
import { useSession } from 'next-auth/react'
import { DELETE } from '@/api/axios'

const TopChat = () => {
	const [open, setOpen] = useState<boolean>(false)

    const { currentChatUser } = useCurrentChatUser()
	
	const {onlineUsers} = useAuthStore()
	const {data : session, update} =  useSession()
	

  const checkContactExists = () => {
  const contactIds = session?.currentUser?.contacts?.map(String) || [];
  return contactIds.includes(String(currentChatUser?._id));
 };

     const handleCopy = async (textToCopy : any) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
	 
      toast({ description: 'Username copied to clipboard!' });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  
  const deleteContact = async (contactId : string) => {	 
  const token = await generateToken(session?.currentUser)
  await DELETE('/user/delete-contact/', contactId, token)
  await update()
  setOpen(false)
 }

  return (
    <div className='w-full flex items-center justify-between sticky top-0 z-50 h-[6vh] p-2 border-b bg-background'>
        <div className='flex items-center'>
            <Avatar className='z-40'>
					<AvatarImage src={currentChatUser?.userImage?.url} alt={currentChatUser?.email} className='object-cover' />
					<AvatarFallback className='uppercase'>{currentChatUser?.email[0]}</AvatarFallback>
				</Avatar>
                <div className='ml-2'>
                    <h2 className='font-medium text-sm'>{currentChatUser?.email}</h2>
                    {/* TYPING */}
                    {/* <div className='text-xs flex items-center gap-1 text-muted-foreground'>
									<p className='text-secondary-foreground animate-pulse line-clamp-1'>Typing</p>
									<div className='self-end mb-1'>
										<div className='flex justify-center items-center gap-1'>
											<div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.3s]'></div>
											<div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.10s]'></div>
											<div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.15s]'></div>
										</div>
									</div>
								</div> */}
                   <p className='text-xs'>
									
										{/* <>
											<span className='text-green-500'>●</span> Online
										</> */}
									
										<>
										{onlineUsers.some(user => user?._id === currentChatUser?._id) ? (
											<span className='text-green-500'>Online</span>
										) : (
											<span className='text-gray-500'>Last seen recently</span>
										)}
										</>
								
								</p>
                     {/* ONLINE */}
                </div>
        </div>
		<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
	   <Button size={'icon'} type='button' variant={'secondary'}>
          <Settings2/>
        </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle/>
    </SheetHeader>
	<div className='mx-auto w-1/2 max-md:w-1/4 h-36 relative'>
						<Avatar className='w-36 h-36 mx-auto'>
							<AvatarImage src={currentChatUser?.userImage?.url} alt={currentChatUser?.email} className='object-cover' />
							<AvatarFallback className='text-6xl uppercase font-spaceGrotesk'>{currentChatUser?.email[0]}</AvatarFallback>
						</Avatar>
					</div>
					<Separator className='my-2' />

					<h1 className='text-center text-xl'>{currentChatUser?.firstName} {currentChatUser?.lastName}</h1>

					<div className='flex flex-col space-y-5'>
						
						{currentChatUser?.email && (
							<div className=' items-center gap-1 mt-4 border-b-2 py-1 '>
								<p className='font-spaceGrotesk'>Email </p>
								<p className='font-spaceGrotesk text-muted-foreground'>{currentChatUser?.email}</p>
							</div>
						)}
						{currentChatUser?.bio && (
							<div className=' items-center gap-1 mt-4 border-b-2 py-1 mb-3'>
								<p className='font-spaceGrotesk'>Bio </p>
								<p className='font-spaceGrotesk'>
									 <span className='font-spaceGrotesk text-muted-foreground'>{currentChatUser?.bio}</span>
								</p>
							</div>
						)}
						{currentChatUser?.username && (
							<div className='flex justify-between items-center  gap-1 mt-4 border-b-2 py-1 mb-3'>
								<div>

								<p className='font-spaceGrotesk'>Username </p>
								<p className='font-spaceGrotesk'>
									 <span className='font-spaceGrotesk text-muted-foreground'>{currentChatUser?.username}</span>
								</p>
								</div>
								<div>
									<button onClick={() => handleCopy(currentChatUser?.username)}><Copy size={16}/></button>
								</div>
							</div>
						)}
					    {/* <Separator className='my-2' />
						<h2 className='text-xl'>Image</h2>
						<div className='flex flex-col space-y-2'>
							{messages
								.filter(msg => msg.image)
								.map(msg => (
									<div className='w-full h-36 relative' key={msg._id}>
										<Image src={msg.image} alt={msg._id} fill className='object-cover rounded-md' />
									</div>
								))}
						</div> */}
						{
							checkContactExists() && (<div>
							<Button onClick={() => deleteContact(String(currentChatUser?._id))} variant='destructive' className='w-full mt-4 mb-2'>Delete Contact</Button>
						    </div>	)
						}
						
					</div>

					
  </SheetContent>
</Sheet>
     
    </div>
  )
}

export default TopChat