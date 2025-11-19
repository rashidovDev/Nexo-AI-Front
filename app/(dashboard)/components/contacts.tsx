import React, { FC } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IContact, IUser } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useCurrentChatUser } from '@/services/current-chat'
import { useAuthStore } from '@/services/use-auth'

interface Props {
    contacts : IUser[]
}

const Contacts : FC <Props> = ({contacts}) => {

  const {currentChatUser, setCurrentChatUser} = useCurrentChatUser()
  const router = useRouter()
  const {onlineUsers} = useAuthStore()
  console.log('online users in contacts component', onlineUsers)

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
      {contacts?.length > 0 ? contacts?.map((contact) => (
        <div
          onClick={() => selectChat(contact)}
           key={String(contact?._id)}
          className='flex items-center h-10 my-2 px-1'
        >
          {/* Avatar */}
          <div className='relative'>
 <Avatar className='w-9 h-9'>
  <AvatarImage src={contact?.userImage?.url}  alt={contact?.email} className='object-cover'/>
  <AvatarFallback className='uppercase'>{contact?.firstName}</AvatarFallback>
</Avatar>
{onlineUsers.some(user => user?._id === contact?._id) && (
							<div className='size-3 bg-green-500 absolute rounded-full bottom-0 right-0 !z-40' />
						)}
          </div>

          {/* Name + status */}
     
           <div className='ml-3 border-b w-full '>
            <div className="font-medium ">{contact?.firstName} {contact?.lastName} .</div>
            <div className="text-sm text-slate-400">last seen recently</div>
          </div>
         

          {/* Action button */}
        </div>
      )
      ) : (
        <div className='text-center text-sm text-slate-400 mt-10'>No contacts found</div>
      )}
    </div>
    </div>
  )
}

export default Contacts