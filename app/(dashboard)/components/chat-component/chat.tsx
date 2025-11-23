import React, { FC, useEffect, useReducer, useRef } from 'react'
import TopChat from './top-chat'
import ChatMessage from './chat-message'
import { UseFormReturn } from 'react-hook-form'
import z from 'zod'
import { messageSchema } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Paperclip, Send, Smile } from 'lucide-react'
import { Input } from '@/components/ui/input'
import emojies from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTheme } from 'next-themes'
import { IMessage } from '@/types'
import { useSelectedOption } from '@/services/current-option'
import { useModal } from '@/services/use-modal'
import { set } from 'mongoose'

interface Props {
  onSubmitMessage : (value : z.infer <typeof messageSchema>) => void
  onReadMessages: () => Promise<void>
  messageForm : UseFormReturn<z.infer <typeof messageSchema>>
  messages : IMessage[]
  onTyping : (e : React.ChangeEvent<HTMLInputElement>) => void
  onReaction: (reaction: string, messageId: string) => Promise<void>
  onDeleteMessage: (messageId: string) => Promise<void>
}

const Chat :FC<Props> = ({onSubmitMessage, messageForm, messages, onReadMessages, onReaction, onDeleteMessage, onTyping}) => {
   const { setOpenUploadFileModal} = useModal()
  
  const {resolvedTheme} = useTheme() 
  const inputRef = useRef<HTMLInputElement | null >(null)
  const { editedMessage, setEditedMessage } = useSelectedOption()
  const scrollRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
  onReadMessages()
  },[messages])

 useEffect(() => {
		if (editedMessage) {
			messageForm.setValue('text', editedMessage.text)
			scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
		}
	}, [editedMessage]) 

	const handleEmojiSelect = (emoji: string) => {
		const input = inputRef.current
		if (!input) return

		const text = messageForm.getValues('text')
		const start = input.selectionStart ?? 0
		const end = input.selectionEnd ?? 0

		const newText = text.slice(0, start) + emoji + text.slice(end)
		messageForm.setValue('text', newText)

		setTimeout(() => {
			input.setSelectionRange(start + emoji.length, start + emoji.length)
		}, 0)
	}
  return (
    <div className='w-full relative'>
     {/* TOP CHAT h-6vh */}

     <TopChat/>

     {/* MESSAGES  h-90vh */}
     <ChatMessage   onReaction={onReaction} messages={messages} onSubmitMessage={onSubmitMessage} onDeleteMessage={onDeleteMessage}/> 

       {/* <div className='w-full h-[88vh] flex items-center justify-center'>
					<div className='text-[100px] cursor-pointer' onClick={() => onSubmitMessage({ text: '✋' })}>
						✋
					</div>
				</div> */}


   {/* Input Message h-5vh */}
   <div className='h-[5vh]'>
  <Form {...messageForm}>
    <form
      onSubmit={messageForm.handleSubmit(onSubmitMessage)}
      className='w-full h-full flex'
    >
      <Button
        size={'icon'}
        type='button'
        variant={'secondary'}
        className='rounded-none h-full'
        onClick={() => setOpenUploadFileModal(true)}
      >
        <Paperclip />
      </Button>

      <FormField
        control={messageForm.control}
        name='text'
        render={({ field }) => (
          <FormItem className='w-full h-full'>
            <FormControl>
              <Input
                className='bg-secondary border-l outline-none focus-visible:ring-0
                 border-l-muted-foreground border-r rounded-none h-full'
                placeholder='Type a message'
                value={field.value}
                onBlur={() => field.onBlur()}
                  onChange={e => {
											field.onChange(e.target.value)
											onTyping(e)
											if (e.target.value === '') setEditedMessage(null)
										}}
                      ref = {inputRef}
              />
            
            </FormControl>
          </FormItem>
        )}
      />
      <Popover>
  <PopoverTrigger asChild><Button size={'sm'} type='button' variant={'secondary'} className='h-full rounded-none'>
       <Smile/>
      </Button></PopoverTrigger>
  <PopoverContent className='p-0 border-none rounded-md absolute right-8 bottom-0'><Picker
								data={emojies}
								theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
								onEmojiSelect={(emoji: { native: string }) => handleEmojiSelect(emoji.native)}
							/></PopoverContent>
</Popover>
      
       <Button type='submit' variant={'secondary'} className='h-full rounded-none w-[50px] bg-primary'>
       <Send/>
      </Button>
    </form>
  </Form>
</div>

       
    </div>
  )
}

export default Chat