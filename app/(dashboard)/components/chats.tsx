 "use client"
import { IChat, IContact, IMessage, IUser } from '@/types'
import React, {FC, JSX} from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentChatUser } from '@/services/current-chat'
import { cn, countUnread, sliceText } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {format} from "date-fns"
import { CONST } from '@/lib/constants'
import { count } from 'console'
import { Check, CheckCheck } from 'lucide-react'
import { useAuthStore } from '@/services/use-auth'

interface Props {
    chats : IChat[]
    allMessages : IMessage[]
    setAllMessages: (allMessages: IMessage[]) => void
}

const Chats : FC <Props> = ({chats, allMessages, setAllMessages}) => {


  const {onlineUsers} = useAuthStore()
const {data : session} = useSession()
const {currentChatUser, setCurrentChatUser, setCurrentChatId , currentChatId} = useCurrentChatUser()
const router = useRouter()

let statusIcon: JSX.Element | null = null;


const renderContact = (chat : IChat) => {

  if (chat?.lastMessage?.sender === session?.currentUser?._id) {
  if (chat?.lastMessage?.status === CONST.READ) {
    statusIcon = <CheckCheck color="#34C759" size={14} />;
  } else if (chat?.lastMessage?.status === CONST.SENT) {
    statusIcon = <Check color="#5800D0" size={14} />;
  }
}
  
  let otherUser: IUser | undefined;

if (!chat?.isGroup) {
  otherUser = chat?.participants?.find(
    (p) => p._id !== session?.currentUser?._id
  );
}


    const selectChat = () => {
        // console.log('chat selected', chat._id)
        // if(currentChatUser?._id === chat._id) return;
        if (!otherUser) return;
        setCurrentChatUser(otherUser)
        setCurrentChatId(chat._id)

       const chatMessages = allMessages.filter(m => m.chat?.toString() === chat._id.toString());
       setAllMessages(chatMessages);
      
  
       router.push(`/?chat=${chat._id}`)
    }

    const unread = allMessages.length > 0
  ? countUnread(allMessages, chat._id, session?.currentUser?._id!)
  : 0;
    return (
      <>
{
  

        <div  onClick={selectChat} key={String(chat?._id)} className={cn(`flex items-center justify-between border-b  
        cursor-pointer p-3 relative`, currentChatId == chat?._id && 'bg-primary text-white' )  }>
        
            <div className='flex items-center gap-2'>
            <div className='relative'>
            <Avatar>
  <AvatarImage src={otherUser?.userImage?.url} alt={otherUser?.email ?? ''} className='object-cover'/>
  <AvatarFallback className='uppercase'>{otherUser?.firstName ?? ''}</AvatarFallback>
</Avatar>
 {onlineUsers.some(user => user?._id === otherUser?._id) && (
							<div className='size-3 bg-green-500 absolute rounded-full bottom-0 right-0 !z-40' />
						)}

            </div>
            <div className='relative '>
    <h2 className='capitalize line-clamp-1 text-sm'>{otherUser?.firstName ? otherUser?.firstName : '.'} {otherUser?.lastName}</h2>
    <p className='text-xs  '>{chat?.lastMessage ? `${sliceText(chat?.lastMessage?.text, 25) }` :  "No messages yet"} </p>
    
</div>
            </div>
            {
              chat?.lastMessage && (
        <div className='absolute right-1 top-1'>
             <p className='text-[10px] dark:text-muted-foreground flex items-center'>
               {statusIcon}
               <span className='ml-1'>{format(chat?.lastMessage?.createdAt, 'hh:mm a')}</span> </p>
            </div>
              )
            }
        {chat?.lastMessage?.sender !== session?.currentUser?._id && chat?.lastMessage?.status === CONST.SENT ?  <div className="absolute bg-slate-300 text-black
             right-2 bottom-2 w-[15px] h-[15px] flex justify-center items-center rounded-full text-[10px]">
             {
      unread > 0 ? unread : 1
    }
              </div> : null }
        </div>
}
      </>
    )
    }
  return (
    <div className=' border-t h-[85vh] overflow-y-auto'>
        {chats?.length == 0 ? (

         <div  className='w-full h-[95vh] flex justify-center items-center'>
            No Chats Found
         </div>  ) :
       
         chats?.map((chat) => (
  <div key={chat._id}>
    {renderContact(chat)}
  </div>
))}
    </div>
  )
}

export default Chats