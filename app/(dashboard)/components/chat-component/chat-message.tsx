import MessageCard from '@/components/cards/message-card'
import ChatLoading from '@/components/loadings/chat-loading'
import React from 'react'

const ChatMessage = () => {
  return (
    <div className='flex flex-col justify-end z-40 min-h-[94vh]'>
        {/* LOADING */}
        {/* <ChatLoading/> */}
        

        {/* MESSAGES */}
        <MessageCard isReceived/>
         <MessageCard />

         <MessageCard isReceived/>
         <MessageCard />

         <MessageCard isReceived/>
         <MessageCard />
         <MessageCard isReceived/>
         <MessageCard />
         <MessageCard isReceived/>
         <MessageCard />
         


        {/* MESSAGE INPUT */}

    </div>
  )
}

export default ChatMessage