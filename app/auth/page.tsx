
import React from 'react'
import { LuMessagesSquare } from "react-icons/lu";
import StateAuth from './components/state';
import ModeToggle from '@/components/ui/custom/mode-toggle';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-option';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getServerSession(authOptions)
  if(session) return redirect('/')

  return (
    <div className="min-h-screen">
      <div className='fixed top-4 right-4'>
        <ModeToggle />
      </div>
      <div className='container min-h-screen flex items-center justify-center py-10'>
        <div className='w-full max-w-5xl flex flex-col items-center space-y-4 text-center'>
          <LuMessagesSquare size={80} className='text-primary mx-auto' />
          <div className='text-4xl font-bold'>
            <h1>Nexo AI</h1>
          </div>
          <p className='text-center text-muted-foreground text-sm max-w-2xl'>
            An AI-powered chat app that goes beyond conversations — your personal assistant for work, life, and everything in between
          </p>
          <StateAuth/>
        </div>
      </div>
    </div>
  )
}

export default Page 
