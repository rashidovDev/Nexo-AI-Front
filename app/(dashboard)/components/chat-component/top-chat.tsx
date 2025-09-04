import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentChatUser } from '@/services/current-chat'
import { Settings2 } from 'lucide-react'
import React from 'react'

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
        <Button size={'icon'} variant={'secondary'}>
          <Settings2/>
        </Button>
    </div>
  )
}

export default TopChat