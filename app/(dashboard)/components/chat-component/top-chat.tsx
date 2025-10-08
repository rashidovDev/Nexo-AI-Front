import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentChatUser } from '@/services/current-chat'
import { Settings2 } from 'lucide-react'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from '@/components/ui/separator'

const TopChat = () => {

    const { currentChatUser } = useCurrentChatUser()
  return (
    <div className='w-full flex items-center justify-between sticky top-0 z-50 h-[6vh] p-2 border-b bg-background'>
        <div className='flex items-center'>
            <Avatar className='z-40'>
					<AvatarImage src={currentChatUser?.avatar} alt={currentChatUser?.email} className='object-cover' />
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
											Last seen recently
										</>
								
								</p>
                     {/* ONLINE */}
                </div>
        </div>
		<Sheet>
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
						<Avatar className='w-full h-36'>
							<AvatarImage src={currentChatUser?.avatar} alt={currentChatUser?.email} className='object-cover' />
							<AvatarFallback className='text-6xl uppercase font-spaceGrotesk'>{currentChatUser?.email[0]}</AvatarFallback>
						</Avatar>
					</div>
					<Separator className='my-2' />

					<h1 className='text-center capitalize font-spaceGrotesk text-xl'>{currentChatUser?.email}</h1>

					<div className='flex flex-col space-y-1'>
						{currentChatUser?.firstName && (
							<div className='flex items-center gap-1 mt-4'>
								<p className='font-spaceGrotesk'>First Name: </p>
								<p className='font-spaceGrotesk text-muted-foreground'>{currentChatUser?.firstName}</p>
							</div>
						)}
						{currentChatUser?.lastName && (
							<div className='flex items-center gap-1 mt-4'>
								<p className='font-spaceGrotesk'>Last Name: </p>
								<p className='font-spaceGrotesk text-muted-foreground'>{currentChatUser?.lastName}</p>
							</div>
						)}
						{currentChatUser?.bio && (
							<div className='flex items-center gap-1 mt-4'>
								<p className='font-spaceGrotesk'>
									About: <span className='font-spaceGrotesk text-muted-foreground'>{currentChatUser?.bio}</span>
								</p>
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
					</div>

					
  </SheetContent>
</Sheet>
     
    </div>
  )
}

export default TopChat