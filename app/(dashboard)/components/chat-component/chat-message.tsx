import MessageCard from '@/components/cards/message-card'
import ChatLoading from '@/components/loadings/chat-loading'
import { messageSchema } from '@/lib/validation'
import { useLoading } from '@/services/use-loading'
import { IMessage } from '@/types'
import React, { FC } from 'react'
import z from 'zod'
import { useRef, useEffect } from 'react'

interface Props {
  messages : IMessage[]
  onSubmitMessage : (value : z.infer <typeof messageSchema>) => void
  onReaction: (reaction: string, messageId: string) => Promise<void>
  onDeleteMessage: (messageId: string) => Promise<void>
}

const ChatMessage : FC <Props> = ({messages, onSubmitMessage, onReaction, onDeleteMessage}) => {

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])

  const {loadMessages} = useLoading()
  return (
    <div className='flex flex-col justify-end z-40 min-h-[88vh]'>
        {/* LOADING */}

        {loadMessages ? <ChatLoading/> :
        	messages?.map((message, index) => (
				<MessageCard  onReaction={onReaction} key={index} message={message} onDeleteMessage={onDeleteMessage}/>
			))}

			{/* Start conversation */}
		{!loadMessages && messages?.length === 0 && (
  <div className='w-full h-[88vh] flex items-center justify-center'>
    <div onClick={() => onSubmitMessage({ text: '✋' })} className='text-[100px] cursor-pointer'>
      ✋
    </div>
  </div>
)}
        {/* <ChatLoading/> */}

        {/* START CHATTING */}
     
        
{/* Messages */}
		
         
  <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessage