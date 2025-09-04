import React from 'react'
import TopChat from './top-chat'
import ChatMessage from './chat-message'

const Chat = () => {
  return (
    <div className='w-full relative'>
     {/* TOP CHAT */}
     <TopChat/>

     {/* MESSAGES */}
     <ChatMessage/> 
       
    </div>
  )
}

export default Chat