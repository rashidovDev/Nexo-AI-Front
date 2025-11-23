"use client"
import React, { FC } from 'react'
import { Button } from '@/components/ui/button'
import { LuMessagesSquare } from 'react-icons/lu'
import { UserPlus } from 'lucide-react';
import { useModal } from '@/services/use-modal'


const AddContact : FC= () => {
	const { setOpenAddContactModal} = useModal()
  return (
   <div className='h-screen w-full flex z-10 relative'>
			<div className='flex justify-center items-center z-50 w-full'>
				<div className='flex flex-col items-center gap-4'>
					<div className='container max-w-md w-full  flex 
    justify-center items-center flex-col space-y-1'>
       
        <LuMessagesSquare size={80} className='text-primary mx-auto'/>
        <div className='text-4xl font-bold'><h1>Nexo AI </h1> </div>
        <p className='text-center text-muted-foreground text-sm'>
            An AI-powered chat app that goes beyond conversations — your personal assistant for work, life, and everything in between
        </p>
           </div>
		   
             <Button onClick={() =>{
				setOpenAddContactModal(true)
			 } } type='submit' className='w-full' size={'lg'}>
						<UserPlus size={16}/> Add Contact
			</Button>		
				</div>
			</div>
		</div>
  )
}

export default AddContact