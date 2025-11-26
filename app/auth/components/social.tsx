"use client"

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import {  FaGithub, FaGoogle } from 'react-icons/fa6'

const Social = () => {

  const [isLoading, setIsloading] = useState<boolean>(false)

  const onSignIn = async (provider : string) => {
    setIsloading(true)
    await signIn(provider, { callbackUrl: '/' })
  }

  return (
    <div className='grid grid-cols-2 w-full gap-1'>
     <Button variant={"outline"} className='w-full' onClick={() => onSignIn('google')} disabled={isLoading}>
        <span>Sign up with Google</span>
        <FaGoogle  size={20}/>  
        </Button>
<Button variant={"secondary"} className='w-full' onClick={() => onSignIn('github')} disabled={isLoading}>
        <span>Sign up with Github</span>
        <FaGithub  size={20}/>  
        </Button>
    </div>
  )
}

export default Social