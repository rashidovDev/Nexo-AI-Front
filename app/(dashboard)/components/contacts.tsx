import React, { FC } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IUser } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useCurrentChatUser } from '@/services/current-chat'

interface Props {
    chats : IUser[]
}

const Contacts : FC <Props> = ({chats}) => {

  const {currentChatUser, setCurrentChatUser} = useCurrentChatUser()
  const router = useRouter()

  const selectChat = (chat : IUser) => {
        console.log('chat selected', chat._id)
        if(currentChatUser?._id === chat._id) return;
        setCurrentChatUser(chat)
       router.push(`/?chat=${chat._id}`)
    }

  return (
  <div 

  className="cursor-pointer">
      <div className="">
      {chats.map((contact) => (
        <div
          onClick={() => selectChat(contact)}
          key={contact._id}
          className='flex items-center h-10 my-2 px-1'
        >
          {/* Avatar */}
 <Avatar>
  <AvatarImage src={contact.avatar} alt={contact.email} className='object-cover'/>
  <AvatarFallback className='uppercase'>{contact.name[0]}</AvatarFallback>
</Avatar>

          {/* Name + status */}
     
           <div className='ml-3 border-b w-full '>
            <div className="font-medium ">{contact.firstName} {contact.lastName} .</div>
            <div className="text-sm text-slate-400">last seen recently</div>
          </div>
         

          {/* Action button */}
        </div>
      ))}
    </div>
    </div>
  )
}

export default Contacts