"use client"
import React, { useEffect } from 'react'
import Chats from './components/chats';
import Header from './components/header';
import LeftBar from './components/leftbar';
import Footer from './components/footer';
import { useRouter } from 'next/navigation';
import AddContact from './components/add-contact';
import Chat from './components/chat-component/chat';
import { useCurrentChatUser } from '@/services/current-chat';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { contactSchema, emailSchema, messageSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelectedOption } from '@/services/current-option';
import Contacts from './components/contacts';
import Settings from './components/settings';

const Home = () => {
  const router = useRouter();
  const {currentChatUser} = useCurrentChatUser()
  const {selectedOption} = useSelectedOption()

  const contactForm = useForm<z.infer<typeof contactSchema>>({
          resolver : zodResolver(contactSchema),
          defaultValues: {
              email: '',
              name : ''
          }
      })

       const messageForm = useForm<z.infer<typeof messageSchema>>({
          resolver : zodResolver(messageSchema),
          defaultValues: {
             message : '',
             image : ''
          }
      })

  useEffect(() => {
     router.replace("/")
  }, []);
 

    const onCreateContact = (values: z.infer<typeof contactSchema>) => {
          console.log(values)
      }

       const onSendMessage = (values: z.infer<typeof messageSchema>) => {
          console.log(values)
      }
  return (
    <div>
      {/* Sidebar */}
      <div className='fixed  inset-0 w-[350px] h-screen z-50 border-r flex'>
        {/* LEFTPART */}
        <div className='w-[20%]'>
          <LeftBar/>
        
        </div>
        <div className='w-[80%] border-l relative'>


        {/* HEADER */}
        <Header/>
     
        {/* LOADER */}
        {/* <div className='w-full h-[95vh] flex justify-center items-center'>
           <Loader2 size={50} className='animate-spin'/>
        </div> */}

        {/* {CHATS} */}
        {selectedOption === 'chats' ?  <Chats chats={chats} /> 
        :  selectedOption === 'contacts' ? <Contacts chats={chats}/> 
        : selectedOption === 'settings' && <Settings/>
        }
       
        <Footer/>
        </div>

        {/* FOOTER */}
        
        
      </div>
      <div className='pl-[350px]'>
        {/* ADD CONTACT */}
       {!currentChatUser?._id &&  <AddContact contactForm={contactForm} onCreateContact={onCreateContact}/>}
       {/* CHAT */}
       {currentChatUser?._id &&  <Chat messageForm={messageForm} onSendMessage={onSendMessage}/>}
      </div>
      
    </div>
    
  )
}

export default Home

const chats = [
  {
    _id: '1',
    name: "John Doe",
    email: "jajdjd@gmail.com",
  avatar : "https://github.com/shadcn.png",
   firstName : "Anvar",
   lastname : "Rashidov"
},

 
   {
    _id: '2',
    name: "Adam Doe",
    email: "asasd@gmail.com"},
      {
    _id: '3',
    name: "Muham Doe",
    email: "jajdjd@gmail.com"},
      {
    _id: '4',
    name: "Sardor Doe",
    email: "jajdjd@gmail.com"},  
    {
    _id: '5',
    name: "Anvar Doe",
    email: "jajdjd@gmail.com"
  }]