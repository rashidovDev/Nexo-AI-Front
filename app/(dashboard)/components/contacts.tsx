import React, { FC } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IChat, IContact, IUser } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useCurrentChatUser } from '@/services/current-chat'
import { useAuthStore } from '@/services/use-auth'

import { useSelectedOption } from '@/services/current-option'
import { UserPlus } from 'lucide-react'
import { useModal } from '@/services/use-modal'

interface Props {
    contacts : IUser[]
    createDM: ( userId: string) => Promise<IChat | undefined>
}

const Contacts : FC <Props> = ({contacts, createDM}) => {
    const {setSelectedOption} = useSelectedOption()
  const {setOpenAddContactModal} = useModal()
  const {currentChatUser, setCurrentChatUser, setCurrentChatId} = useCurrentChatUser()
  const router = useRouter()
  const {onlineUsers} = useAuthStore()

 const selectChat = async (contact: IUser) => {
  // If already current chat, do nothing
  if (currentChatUser?._id === contact._id) return;

  // Create or fetch the DM
  const chat = await createDM(contact._id.toString());
  if (!chat) return; // stop if failed

  // Set current chat user
  setCurrentChatUser(contact);

  // Navigate to chat
  router.push(`/?chat=${chat._id}`);
   setCurrentChatId(chat._id);
  setSelectedOption('chats');
};

  return (
  <div 
  className="cursor-pointer p-1">
      <div className="">
        <div onClick={() => setOpenAddContactModal(true)} className='ml-3  border-b flex items-center cursor-pointer '>
            <UserPlus size={18} className='text-primary mb-2'/>
            <div className="ml-5 mb-2 text-primary">Invite Friend</div>
          </div>
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