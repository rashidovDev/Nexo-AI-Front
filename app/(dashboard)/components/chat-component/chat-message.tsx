import MessageCard from '@/components/cards/message-card'
import ChatLoading from '@/components/loadings/chat-loading'
import React from 'react'

const ChatMessage = () => {
  return (
    <div className='flex flex-col justify-end z-40 min-h-[89vh]'>
        {/* LOADING */}
        {/* <ChatLoading/> */}

        {/* START CHATTING */}
     
        

        MESSAGES
        <MessageCard isReceived/>
         <MessageCard />
         

    </div>
  )
}

export default ChatMessage