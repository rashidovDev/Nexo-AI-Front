import { cn } from '@/lib/utils'
import { useCurrentChatUser } from '@/services/current-chat'
import { IMessage } from '@/types'
import React, { FC } from 'react'
import {format} from "date-fns"
import { CONST } from '@/lib/constants'
import { Check, CheckCheck, Delete, Edit, Trash } from 'lucide-react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ContextMenuSeparator } from '@/components/ui/context-menu'


interface Props {
    message  : IMessage
}

const MessageCard : FC <Props> = ({message}) => {


  	const reactions = ['👍', '😂', '❤️', '😍', '👎']


  const {currentChatUser} = useCurrentChatUser()
  return (
    <ContextMenu>
  <ContextMenuTrigger asChild>
    <div className={cn('m-2.5 font-medium text-xs flex ', message?.sender === currentChatUser?._id  ? 'justify-start' : 'justify-end')}>
      <div className={cn('relative inline p-2 pl-2.5 pr-12 max-w-full rounded-lg', message?.sender === currentChatUser?._id ? 'bg-primary' : 'bg-secondary')}>
           <p className='text-sm text-white ' > {message?.text}</p>
           <div className='right-1 bottom-0 absolute opacity-60 text-[9px] flex gap-[3px]'>
							<p className=''>{format(message.updatedAt, 'hh:mm')}</p>
    
							<div className='self-end'>
								{message.sender !== currentChatUser?._id &&
									(message.status === CONST.READ ? <CheckCheck size={12} /> : <Check size={12}/>)}
							</div>
						</div>
      </div>
    </div>
  </ContextMenuTrigger>
  <ContextMenuContent className=''>
    <div className='flex items-center  justify-center'>

    {reactions.map((reaction) => (
      <ContextMenuItem key={reaction} className='text-lg cursor-pointer'>
        {reaction}
      </ContextMenuItem>
    ))}
    </div>
   {message.sender !== currentChatUser?._id && (
         <div className='flex flex-col'>
         <ContextMenuSeparator />
       
        
         <ContextMenuItem className='cursor-pointer'>
           <Edit size={14} className='mr-2' />
           <span>Edit</span> 
         </ContextMenuItem>
             <ContextMenuSeparator className=''/>
             <ContextMenuItem className='text-red-500  cursor-pointer '>
           <Trash size={14} className='mr-2' />
           <span>Delete</span> 
         </ContextMenuItem>
         </div>
       )}
  
  </ContextMenuContent>
</ContextMenu>
    
  )
}

export default MessageCard