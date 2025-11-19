"use client"

import React, { useEffect, useRef, useState } from "react"
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
import { IChat, IMessage, IUser } from "@/types"
import AddContactCard from "@/components/cards/add-contact-card"
import { useDialog } from "@/services/use-dialog"
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

interface GetSocketType {
  receiver: IUser
  sender: IUser
  message: IMessage
}

const Home = () => {
  const router = useRouter()
  const [contacts, setContacts] = useState<IUser[]>([])
  const [messages, setMessages] = useState<IMessage[]>([])
  const [allMessages, setAllMessages] = useState<IMessage[]>([]); 
  const [chats, setChats] = useState<IChat[]>([])
  const socket = useRef<ReturnType<typeof io> | null>(null)

  const { setCreating, setLoadMessages } = useLoading()
  const { currentChatUser, currentChatId } = useCurrentChatUser()
  const { selectedOption, searchQuery } = useSelectedOption()
  const { openAddContactDialog } = useDialog()
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
    console.log("Last Msg in chat:", lastMsg);
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
     if(currentChatId === message.chat) {    
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



    return () => {
      socket.current?.off("getOnlineUsers")
      socket.current?.off("getNewContact")
      socket.current?.off("getNewMessage")
    }
  }, [playSound, session?.currentUser, currentChatUser?._id])

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
  const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
    setCreating(true)
    const token = await generateToken(session?.currentUser)
    try {
      const { data } = await apiClient.post<GetSocketType>(
        "/message/send-msg",
        { ...values, receiver: currentChatUser?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("Sent message response:", data)
      setMessages((prev) => {
     if (data.message.chat === prev[0]?.chat) {
       return [...prev, data.message];
       }
      return prev;
    });
      setChats((prev) =>
        prev.map((chat) =>
          chat.participants.some((u) => u._id === currentChatUser?._id)
            ? { ...chat, lastMessage: {...data.message} }
            : chat
        )
      ) 
      messageForm.reset()
      socket.current?.emit("sendMessage", {
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


      // setChats(prev => {
      //   return prev.map(chat => {
      //     const lastMessage = messages.find(msg => msg.chat === chat.lastMessage?._id)
      //     return lastMessage ? { ...chat, lastMessage: {...lastMessage, status : CONST.READ}} : chat
      //   })
      // })
		} catch {
			toast({ description: 'Cannot read messages', variant: 'destructive' })
		}
	}

  // 🔹 RENDER
  return (
    <div>
      <div className="w-[300px] mx-auto">
        {openAddContactDialog && (
          <AddContactCard contactForm={contactForm} onCreateContact={onCreateContact} />
        )}
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
            <Contacts contacts={contacts} />
          ) : (
            selectedOption === "settings" && <Settings />
          )}

          <Footer />
        </div>
      </div>

      <div className="pl-[350px]">
        {!currentChatUser?._id && <AddContact />}
        {currentChatUser?._id && (
          <Chat messageForm={messageForm} messages={messages} onSendMessage={onSendMessage} onReadMessages={onReadMessages}/>
        )}
      </div>
    </div>
  )
}

export default Home
