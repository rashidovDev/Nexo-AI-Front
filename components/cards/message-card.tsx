import { cn } from '@/lib/utils'
import { useCurrentChatUser } from '@/services/current-chat'
import { IMessage } from '@/types'
import React, { FC } from 'react'
import {format} from "date-fns"
import { CONST } from '@/lib/constants'
import { Check, CheckCheck, Delete, Edit, Trash } from 'lucide-react'
import { sliceText } from '@/lib/utils'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ContextMenuSeparator } from '@/components/ui/context-menu'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useSession } from 'next-auth/react'
import { useSelectedOption } from '@/services/current-option'




interface Props {
    message  : IMessage
    onReaction: (reaction: string, messageId: string) => Promise<void>
      onDeleteMessage: (messageId: string) => Promise<void>
}

const MessageCard : FC <Props> = ({message, onReaction, onDeleteMessage}) => {



    const {data : session} = useSession()
    
    	const { setEditedMessage } = useSelectedOption()
  	const reactions = ['👍', '😂', '❤️', '😍', '👎']




	const {currentChatUser} = useCurrentChatUser()
	const lastSeenEntry =
		message?.readBy
			?.filter(item => String(item.user) !== String(session?.currentUser?._id))
			?.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())[0]

	const lastSeenAt = lastSeenEntry?.at ? new Date(lastSeenEntry.at) : null
	const messageSentAt = new Date(message.updatedAt)
	const lastSeenLabel = lastSeenAt
		? `read at      ${format(lastSeenAt, 'hh:mm')}`
		: `read at      ${format(messageSentAt, 'hh:mm')}`
  return (
    <ContextMenu>
  <ContextMenuTrigger asChild>
    <div className={cn('m-2.5 font-medium text-xs flex touch-manipulation select-none', message?.sender === currentChatUser?._id  ? 'justify-start' : 'justify-end')}>
      <div className={cn('relative inline p-2 pl-2.5 pr-12 max-w-full rounded-lg ', message?.sender === currentChatUser?._id ? 'bg-primary text-white' : 'bg-secondary')}>
       {message?.image ? (
    <div className='w-[200px]'>

      <Image src={message?.image} alt={message?.image} width={201} height={150} className='rounded-lg object-cover mx-auto'/>
    </div>
       ): (
 <p className={cn('text-sm dark:text-white  text-slate-800', message?.sender === currentChatUser?._id ? ' text-white' : 'bg-secondary')} > {message?.text}</p>
       )}
          
           <div className='flex items-center justify-between '>

           <div className='right-1 bottom-0 absolute opacity-60 text-[9px] flex gap-[3px]'>
							<p className=''>{format(message.updatedAt, 'hh:mm')}</p>
           
             
    
							<div className='self-end'>
								{message.sender !== currentChatUser?._id &&
									(message.status === CONST.READ ? <CheckCheck size={12} /> : <Check size={12}/>)}
							</div>       
						</div>

            {message?.reactions && ( 
              message.reactions.length > 0) && ( message.reactions.map((reaction) => (
              <div  key={reaction._id} onClick = {() => {
              if(reaction.user._id === session?.currentUser?._id){
              onReaction('', message._id) 
                }
             return
              } } 
              className={cn('cursor-pointer mr-1  p-1 w-[50px] h-[30px]  bg-white rounded-lg flex items-center justify-between mt-1',
               message?.sender === session?.currentUser?._id && 'dark:bg-white bg-primary')}>
                <span>{reaction.reaction}</span> 
                <Avatar className='w-5 h-5'>
                  <AvatarImage src={reaction.user.userImage?.url} className='object-cover'/>
                  <AvatarFallback className='uppercase'>{reaction.user?.firstName}</AvatarFallback>
                </Avatar>
              </div>
              ))
            )}
            
             </div>
            
      {/* <span className={cn(`absolute `,  message?.sender === currentChatUser?._id ?  '-right-2' : '-left-2')}>❤️</span> */}
      </div>
    </div>
  </ContextMenuTrigger>
  <ContextMenuContent className=''>
    <div className='flex items-center  justify-center'>

    {reactions.map((reaction) => (
      <ContextMenuItem onClick={() => onReaction(reaction,message._id )} key={reaction} className='text-lg cursor-pointer'>
        {reaction}
      </ContextMenuItem>
    ))}
    </div>
   {message.sender === session?.currentUser?._id && (
         <div className='flex flex-col'>
         <ContextMenuSeparator />
       
		 <ContextMenuItem onClick={() => setEditedMessage(message)} className='cursor-pointer'>
		{lastSeenLabel}
		 </ContextMenuItem>
         <ContextMenuSeparator className=''/>
         <ContextMenuItem onClick={() => setEditedMessage(message)} className='cursor-pointer'>
           <Edit size={14} className='mr-2' />
           <span>Edit</span> 
         </ContextMenuItem>
             <ContextMenuSeparator className=''/>
             <ContextMenuItem onClick={() => onDeleteMessage(message._id)} className='text-red-500  cursor-pointer '>
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
