 "use client"
import { IUser } from '@/types'
import React, {FC} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { useCurrentChatUser } from '@/services/current-chat'
import { cn } from '@/lib/utils'


interface Props {
    chats : IUser[]
}

const Chats : FC <Props> = ({chats}) => {
const {currentChatUser, setCurrentChatUser} = useCurrentChatUser()
const router = useRouter()

const renderContact = (chat : IUser) => {
    const selectChat = () => {
        console.log('chat selected', chat._id)
        if(currentChatUser?._id === chat._id) return;
        setCurrentChatUser(chat)
       router.push(`/?chat=${chat._id}`)
    }
    return (
        <div onClick={selectChat} key={chat._id+1} className={cn(`flex items-center justify-between 
        cursor-pointer p-2 relative`, currentChatUser?._id === chat._id && 'bg-primary text-white' )  }>
            <div className='flex items-center gap-2'>
            <div className='relative'>
              <Avatar>
  <AvatarImage src={chat.avatar} alt={chat.email} className='object-cover'/>
  <AvatarFallback className='uppercase'>{chat.name[0]}</AvatarFallback>
</Avatar>
<div className='size-3 bg-green-500 absolute rounded-full bottom-0 right-0 !z-50'></div>

            </div>
            <div>
    <h2 className='capitalize line-clamp-1 text-sm'>{chat.email.split('@')[0]}</h2>
    <p className='text-xs line-clamp-1 dark:text-muted-foreground '>No messages yet</p>
</div>
            </div>
            <div className='absolute right-1 top-1'>
             <p className='text-[10px] dark:text-muted-foreground'>20:00pm</p>
            </div>
        </div>
    )
    }
  return (
    <div className=' border-t h-[85vh] overflow-y-auto'>
        {chats.length === 0 ?
         <div className='w-full h-[95vh] flex justify-center items-center'>
            No Chats Found
         </div> :
         chats.map((chat) => renderContact(chat))}
    </div>
  )
}

export default Chats