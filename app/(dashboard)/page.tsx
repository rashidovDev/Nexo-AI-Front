"use client"

import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import Chats from "./components/chats"
import Header from "./components/header"
import LeftBar from "./components/leftbar"
import Footer from "./components/footer"
import { useRouter } from "next/navigation"
import AddContact from "./components/add-contact"
import Chat from "./components/chat-component/chat"
import { useCurrentChatUser } from "@/services/current-chat"
import { useForm } from "react-hook-form"
import z from "zod"
import { contactSchema, emailSchema, messageSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSelectedOption } from "@/services/current-option"
import Contacts from "./components/contacts"
import Settings from "./components/settings"
import { IChat, IMessage, IMessageChat, IMsgChat, IUser } from "@/types"
// import AddContactCard from "@/components/cards/add-contact-card"
import { useModal } from "@/services/use-modal"
import { useLoading } from "@/services/use-loading"
import { generateToken } from "@/lib/generate-token"
import { useSession } from "next-auth/react"
import { apiClient } from "@/api/axios"
import { toast } from "@/hooks/use-toast"
import SearchUser from "./components/search-user"
import { io } from "socket.io-client"
import { useAuthStore } from "@/services/use-auth"
import useAudio from "@/services/use-audio"
import { CONST } from "@/lib/constants"
import { set } from "mongoose"
import ModalAddContact from "@/components/Modals/add-contact-modal"
import ModalUploadFile from "@/components/Modals/upload-file-modal"

interface GetSocketType {
  receiver: IUser
  sender: IUser
  message: IMsgChat
}

const Home = () => {
  const router = useRouter()
  const [contacts, setContacts] = useState<IUser[]>([])
  const [messages, setMessages] = useState<IMessage[]>([])
  const [allMessages, setAllMessages] = useState<IMessage[]>([]); 
  const [chats, setChats] = useState<IChat[]>([])
  const socket = useRef<ReturnType<typeof io> | null>(null)

  const { setCreating, setLoadMessages, setTyping } = useLoading()
  const { currentChatUser, currentChatId } = useCurrentChatUser()
  const { selectedOption, searchQuery, editedMessage, setEditedMessage } = useSelectedOption()
  const { openAddContactModal } = useModal()
  const { setOnlineUsers } = useAuthStore()
  const { playSound } = useAudio()
  const { data: session, update } = useSession()
  const { setLoading } = useLoading()

  // 🔹 SOCKET SETUP
  useEffect(() => {
    socket.current = io("ws://localhost:4000")
    console.log("Socket initialized")

    return () => {
      socket.current?.disconnect()
      console.log("Socket disconnected")
    }
  }, [])

  // 🔹 RE-ADD USER AFTER CONNECT OR RECONNECT
 useEffect(() => {
  if (!socket.current) return

  socket.current.on("connect_error", (err) => {
    console.log("Socket connect error:", err.message)
  })

  socket.current.io.on("reconnect", () => {
    console.log("Reconnected with ID:", socket.current?.id)
    if (session?.currentUser) {
      socket.current?.emit("addOnlineUser", session.currentUser)
    }
  })

  return () => {
    socket.current?.off("connect_error")
    socket.current?.io.off("reconnect")
  }
}, [session?.currentUser])


  // 🔹 SOCKET EVENT LISTENERS (REGISTER ONCE)
  useEffect(() => {
    if (!socket.current) return

    socket.current.on("getOnlineUsers", (data: { socketId: string; user: IUser }[]) => {
      setOnlineUsers(data.map((item) => item.user))
    })

    socket.current.on("getNewContact", (user: IUser) => {
      setContacts((prev) => {
        const isExist = prev.some((item) => item._id === user._id)
        return isExist ? prev : [...prev, user]
      })
    })

    socket.current.on("getNewChatCreated", ({ message, receiver }: { message: IMessageChat; receiver: IUser }) => {
     
  setChats((prev) => {
  const isExist = prev.some((item) => item._id === message.chat._id)
  return isExist
    ? prev
    : [
        ...prev,
        {
          _id: message.chat?._id,
          participants: message.chat?.participants,
          lastMessage: message.chat?.lastMessage,
          isGroup: false, // required
        } as IChat,
      ]
})
    })

    socket.current?.on('messagesReadByReceiver', (messages: IMessage[]) => {
     
				setMessages(prev => {
					return prev.map(item => {
						const message = messages.find(msg => msg._id === item._id)
						return message ? { ...item, status: CONST.READ } : item
					})
				})

       setChats(prev =>
    prev.map(chat => {
    const lastMsg = messages.find(msg => msg._id === chat.lastMessage?._id);

    if (lastMsg) {
      return {
        ...chat,
        lastMessage: {
          ...chat.lastMessage!,
          status: CONST.READ
        }
      };
    }

    return chat;
  })
);

			})

    socket.current.on("getNewMessage", ({ message, receiver, sender }: GetSocketType) => {
       setAllMessages((prev) => [...prev, message])
       
     if(currentChatId === message.chat._id.toString()) {    
        setMessages((prev) => {  
        const isExist = prev.some((item) => item._id === message._id)
        return isExist ? prev : [...prev, message]
      })
     }
     
       setChats((prev) => {
       return prev.map((chat) => {
          if (chat.participants.some((u) => u._id === sender._id)) {
            return { ...chat, lastMessage: message }
          }
          return chat
       })
       }
      )
      if (!receiver?.muted) {
        playSound(receiver?.notificationSound || "sending.mp3")
      }

    })

    socket.current?.on('getUpdatedMessage', ( {updatedMessage, receiver, sender}  ) => {
				// setTyping({ message: '', sender: null })
				setMessages(prev =>
					prev.map(item =>
						item._id === updatedMessage._id ? { ...item, reactions: updatedMessage.reactions, text: updatedMessage.text } : item
					)
				)
				setChats(prev =>
					prev.map(item =>
						item._id === currentChatId
							? { ...item, lastMessage: item.lastMessage?._id === updatedMessage._id ? updatedMessage : item.lastMessage }
							: item
					)
				)
			})

    socket.current?.on('getDeletedMessage', ( {deletedMessage, receiver, sender, filteredMessages}  ) => {
        // setTyping({ message: '', sender: null })
    
      setMessages (filteredMessages)
      const lastMessage = filteredMessages.length ? filteredMessages[filteredMessages.length - 1] : null;
          setChats(prev =>
  prev.map(item =>
    item._id === currentChatId
      ? ({
          ...item,
          lastMessage:  
            item.lastMessage && item.lastMessage._id === deletedMessage._id
              ? lastMessage // your new value
              : item.lastMessage
        } as IChat)
      : item
  )
);
    })

    socket.current?.on("getTypingMessage", ({ message, sender, receiver }: { message: string; sender: IUser, receiver : IUser }) => {
          if(receiver._id !== currentChatUser?._id){
           setTyping({ sender, message})
          }

       
        
    })

    return () => {
      socket.current?.off("getOnlineUsers")
      socket.current?.off("getNewContact")
      socket.current?.off("getNewMessage")
    }
  },[playSound, session?.currentUser, currentChatUser?._id])

  // 🔹 FETCH CONTACTS
  const getContacts = async () => {
    setLoading(true)
    const token = await generateToken(session?.currentUser)
    try {
      const { data } = await apiClient.get<{ contacts: IUser[] }>("/user/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setContacts(data.contacts)
      
    } catch {
      toast({ description: "Cannot fetch contacts", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // 🔹 FETCH CHATS
  const getChats = async () => {
    setLoading(true)
    const token = await generateToken(session?.currentUser)
    try {
      const { data } = await apiClient.get("/chat/chats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setChats(data)
     
    } catch {
      toast({ description: "Cannot fetch chats", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.currentUser) getChats()
  }, [session?.currentUser])

  // 🔹 FETCH MESSAGES
  const getMessages = async () => {
    setLoadMessages(true)
    setMessages([])
    const token = await generateToken(session?.currentUser)
    try {
      const { data } = await apiClient.get<{ messages: IMessage[] }>(
        `/message/chat-id/${currentChatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAllMessages(data.messages)
      setMessages(data.messages)
    } catch {
      toast({ description: "Cannot fetch messages", variant: "destructive" })
    } finally {
      setLoadMessages(false)
    }
  }

  useEffect(() => {
    if (currentChatUser?._id) {
      getMessages()
    }
  }, [currentChatUser])

  // 🔹 EMIT USER ONLINE + FETCH CONTACTS
  useEffect(() => {
    if (session?.currentUser?._id) {
      socket.current?.emit("addOnlineUser", session.currentUser)
      getContacts()
    }
  }, [session?.currentUser])

  // 🔹 FORM HOOKS
  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "" },
  })

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "", image: "" },
  })

  // 🔹 ADD CONTACT
  const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
    setCreating(true)
    const token = await generateToken(session?.currentUser)
    try {
      const { data } = await apiClient.post<{ contact: IUser }>(
        "/user/create-contact",
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setContacts((prev) => [...prev, data.contact])
      socket.current?.emit("newContact", {
        currentUser: session?.currentUser,
        receiver: data.contact,
      })
      await update()
      toast({ description: "Contact added successfully" })
      contactForm.reset()
    } catch (error: any) {
      toast({
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  // 🔹 SEND MESSAGE


  const onReadMessages = async () => {
		const receivedMessages = messages
			.filter(message => String(message?.receiver) === session?.currentUser?._id)
			.filter(message => message.status !== CONST.READ)

		if (receivedMessages.length === 0) return
		const token = await generateToken(session?.currentUser)
		try {
			const { data } = await apiClient.post<{ messages: IMessage[] }>(
				'/message/mark-read',
				{ messages: receivedMessages},
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			socket.current?.emit('messageRead', { messages: data.messages, receiver: currentChatUser })
     
		setMessages(prev => {
  return prev.map(item => {
    const message = data.messages.find(msg => msg._id === item._id)
    
    return message ? { ...item, status: CONST.READ } : item
  })
})
setChats(prev =>
  prev.map(chat => {
    if (chat._id !== currentChatId) return chat;

    const updated = data.messages.find(
      msg => msg._id === chat.lastMessage?._id
    );

    if (!updated) return chat;


    return {
      ...chat,
      lastMessage: {
        ...chat.lastMessage!,
        status: CONST.READ
      }
    };
  })
);
		} catch {
			toast({ description: 'Cannot read messages', variant: 'destructive' })
		}
	}

  const onReaction = async (reaction: string, messageId: string) => {
		const token = await generateToken(session?.currentUser)
		try {
			const { data } = await apiClient.put<{ result: IMessage }>(
				'/message/add-reaction',
				{ reaction, messageId },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			setMessages(prev =>
				prev.map(item => (item._id === data.result._id ? { ...item, reactions: data.result.reactions } : item))
			)
			socket.current?.emit('updateMessage', {
				updatedMessage: data.result,
				receiver: currentChatUser,
				sender: session?.currentUser,
			})
		} catch {
			toast({ description: 'Cannot react to message', variant: 'destructive' })
		}
	}

   const onDeleteMessage = async (messageId: string) => {
		const token = await generateToken(session?.currentUser)
		try {
			const { data } = await apiClient.delete<{ deletedMessage: IMessage }>(
				`/message/delete-message/` + messageId,
	
			{ headers: { Authorization: `Bearer ${token}` } }
			)
      const filteredMessages = messages.filter(item => item._id !== data.deletedMessage._id);
      setMessages (filteredMessages)
      const lastMessage = filteredMessages.length ? filteredMessages[filteredMessages.length - 1] : null;
    setChats(prev =>
  prev.map(item =>
    item._id === currentChatId
      ? ({
          ...item,
          lastMessage:
            item.lastMessage && item.lastMessage._id === messageId
              ? lastMessage // your new value
              : item.lastMessage
        } as IChat)
      : item
  )
);
      socket.current?.emit('deleteMessage', {
        deletedMessage: data.deletedMessage,
        receiver: currentChatUser,
        sender: session?.currentUser,
        filteredMessages
      })

    

      // setChats(prev =>
      //   prev.map(chat =>
      //     chat._id === currentChatId
      //       ? {
      //           ...chat,
      //           lastMessage:
      //             chat.lastMessage?._id === messageId
      //               ? null
      //               : chat.lastMessage,
      //         }
      //       : chat
      //   )
      // )   

		} catch {
			toast({ description: 'Cannot react to message', variant: 'destructive' })
		}
	}


  const onSubmitMessage = async (values: z.infer<typeof messageSchema>) => {
		setCreating(true)
		if (editedMessage) {
			onEditMessage(editedMessage._id, values.text)
		} else {
			onSendMessage(values)
		}
	}

    const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
    setCreating(true)
    const token = await generateToken(session?.currentUser)
    try {
      const { data } = await apiClient.post<GetSocketType>(
        "/message/send-msg",
        { ...values, receiver: currentChatUser?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
  setMessages(prev => {
  const exists = prev.some(m => m._id === data.message._id);
  if (exists) return prev;

  return [...prev, data.message];
});


await getChats()
setChats((prev) =>
        prev.map((chat) =>
          chat.participants.some((u) => u._id === currentChatUser?._id)
            ? { ...chat, lastMessage: {...data.message} }
            : chat
        )
      ) 
       socket.current?.emit("sendMessage", {
        message: data.message,
        receiver: data.receiver,
        sender: data.sender,
      })

      messageForm.reset()
      socket.current?.emit("newChatCreated", {
        message: data.message,
        receiver: data.receiver,
        sender: data.sender,
      })

     
    } catch {
      toast({ description: "Failed to send message", variant: "destructive" })
    } finally {
      setCreating(false)
    }
  }

  const onEditMessage = async (messageId: string, text : string) => {
		const token = await generateToken(session?.currentUser)
		try {
			const { data } = await apiClient.put<{ updatedMessage: IMessage }>(
				'/message/edit-message',
				{ messageId, text },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			setMessages(prev =>
				prev.map(item => (item._id === data.updatedMessage._id ? { ...item, text: data.updatedMessage.text } : item))
			)

      socket.current?.emit('updateMessage', {
				updatedMessage: data.updatedMessage,
				receiver: currentChatUser,
				sender: session?.currentUser,
			})

      setChats(prev => prev.map(item =>(
        item._id === currentChatId ? { ...item, lastMessage: item.lastMessage?._id === data.updatedMessage._id ? data.updatedMessage : item.lastMessage } : item
      )))

        messageForm.reset()
			// socket.current?.emit('updateMessage', {
			// 	updatedMessage: data.result,
			// 	receiver: currentChatUser,
			// 	sender: session?.currentUser,
			// })

      setEditedMessage(null)
		} catch {
			toast({ description: 'Cannot react to message', variant: 'destructive' })
		}
	}

 const onTyping = (e: ChangeEvent<HTMLInputElement>) => {

		socket.current?.emit('typing', { receiver: currentChatUser, sender: session?.currentUser, message: e.target.value })
	}

   const createDM = async (userId: string) => {
  const token = await generateToken(session?.currentUser);
  try {
    const { data } = await apiClient.post<IChat>(
      '/chat/create-dm',
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const chat = data // assign chat here
     setMessages([])
    // update local state
    setChats((prev) => {
      if (prev.some((c) => c._id === chat._id)) return prev;
      return [...prev, chat];
    });
    

    return chat; // return the chat object

  } catch (err) {
    toast({ description: 'Cannot create chat', variant: 'destructive' });
    return undefined; // handle failure
  }
};


  // 🔹 RENDER
  return (
    <div>
      <div className="">
          <ModalAddContact contactForm={contactForm} onCreateContact={onCreateContact}/>
          <ModalUploadFile onSubmitMessage={onSubmitMessage}/>
      </div>

      <div className="fixed inset-0 w-[350px] h-screen z-50 border-r flex">
        <div className="w-[20%]">
          <LeftBar />
        </div>
        <div className="w-[80%] border-l relative">
          <Header />

          {searchQuery.trim() !== "" ? (
            <SearchUser />
          ) : selectedOption === "chats" ? (
            <Chats chats={chats} setAllMessages={setAllMessages} allMessages={allMessages} />
          ) : selectedOption === "contacts" ? (
            <Contacts createDM={createDM} contacts={contacts} />
          ) : (
            selectedOption === "settings" && <Settings />
          )}

          <Footer />
        </div>
      </div>

      <div className="pl-[350px]">
        {!currentChatUser?._id && <AddContact />}
        {currentChatUser?._id && (
          <Chat onTyping={onTyping} onReaction={onReaction} messageForm={messageForm} messages={messages} 
          onSubmitMessage={onSubmitMessage} onReadMessages={onReadMessages} onDeleteMessage={onDeleteMessage}/>
        )}
      </div>
    </div>
  )
}

export default Home
