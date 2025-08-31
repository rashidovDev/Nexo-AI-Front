import React from 'react'
import { LuMessagesSquare } from "react-icons/lu";
import StateAuth from './components/state';
import Social from './components/social';
import ModeToggle from '@/components/ui/custom/mode-toggle';

const Page = () => {
  return (
    <div>
    <div className='fixed top-4 right-4'>
      <ModeToggle />
    </div>
    <div className='container max-w-md w-full h-screen flex 
    justify-center items-center flex-col space-y-4'>
       
        <LuMessagesSquare size={80} className='text-primary mx-auto'/>
        <div className='text-4xl font-bold'><h1>Nexo AI </h1> </div>
        <p className='text-center text-muted-foreground text-sm'>
            An AI-powered chat app that goes beyond conversations — your personal assistant for work, life, and everything in between
        </p>
        <StateAuth/>
        <Social/>
           </div>
    </div>
  )
}

export default Page 