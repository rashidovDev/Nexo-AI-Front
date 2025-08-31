import { Button } from '@/components/ui/button'
import React from 'react'
import {  FaGithub, FaGoogle } from 'react-icons/fa6'

const Social = () => {
  return (
    <div className='grid grid-cols-2 w-full gap-1'>
     <Button variant={"outline"} className='w-full'>
        <span>Sign up with Google</span>
        <FaGoogle  size={20}/>  
        </Button>
<Button variant={"secondary"} className='w-full'>
        <span>Sign up with Github</span>
        <FaGithub  size={20}/>  
        </Button>
    </div>
  )
}

export default Social