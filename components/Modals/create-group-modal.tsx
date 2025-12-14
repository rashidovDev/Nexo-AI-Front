"use client"

import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { contactSchema, groupSchema } from '@/lib/validation';
import z from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModal } from '@/services/use-modal';
import { IUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/services/use-auth';
import { Circle, CircleCheck } from 'lucide-react';


interface Props {
       contacts : IUser[]
  groupForm: UseFormReturn<z.infer<typeof groupSchema>>
  onCreateGroup: (values: z.infer<typeof groupSchema>) => void
}

const ModalCreateGroup: React.FC <Props> = ({ groupForm, onCreateGroup, contacts }) => {


    const {onlineUsers} = useAuthStore()
    const { openCreateGroupModal, setOpenCreateGroupModal} = useModal()
   const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

   const isExist = (id : string) => {
   return selectedUsers.some(item => item === String(id))
   }

   const getBgColor = (id: string, colorIfExist: string, colorIfNotExist: string) => {
  return selectedUsers.some(item => item === id) ? colorIfExist : colorIfNotExist;
};


 const selectUsers = (userId: string) => {
  const newSelection = selectedUsers.includes(userId)
    ? selectedUsers.filter(id => id !== userId)
    : [...selectedUsers, userId];

  setSelectedUsers(newSelection);
  groupForm.setValue("participantIds", newSelection);
};

const handleCreate = (values: z.infer<typeof groupSchema>) => {
  const payload: z.infer<typeof groupSchema> = {
    ...values,
    participantIds: selectedUsers,
  }
  onCreateGroup(payload)
};


    return (
       <AnimatePresence>
  {openCreateGroupModal && (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0  z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpenCreateGroupModal(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        key="modal-box"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className="opacity-100   rounded-[10px] m-auto relative p- items-center justify-center flex"
      >
        <div className=' bg-[#04080F] md:w-[500px] w-[90%] mx-auto border border-gray-700 rounded-lg p-6 '>
        <h1 className=' font-bold text-2xl'>Create Group</h1>
        {/* <p className='text-sm text-left'> Fill in contact details below and submit when you're done.</p> */}



       <Form {...groupForm} >
        <form onSubmit={groupForm.handleSubmit(handleCreate)}>

  <FormField
    control={groupForm.control}
    name='name'
    render={({ field }) => (
      <FormItem>
        <Label>Group Name</Label>
        <FormControl>
          <Input placeholder='Enter group name' {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

   <div className=''>
                               <Label>Add users</Label>
                                {contacts?.length > 0 ? contacts?.map((contact) => (
                               <div
         
           key={String(contact?._id)}
          className='flex items-center h-10 my-5 px-1 relative'
        >
          {/* Avatar */}
          <div style={{  backgroundColor: getBgColor(String(contact._id), '#5900D0', '#fff'), borderRadius: '50%' }}
           onClick={() => selectUsers(String(contact._id))} className='cursor-pointer top-3 right-2 absolute '>
  
            {isExist(String(contact._id)) ? <CircleCheck  /> : <Circle />}         
                                </div>
          <div className='relative'>
 <Avatar className='md:w-8 md:h-8 w-6 h-6'>
  <AvatarImage src={contact?.userImage?.url}  alt={contact?.email} className='object-cover'/>
  <AvatarFallback className='uppercase'>{contact?.firstName}</AvatarFallback>
</Avatar>
{onlineUsers.some(user => user?._id === contact?._id) && (
							<div className='size-1 bg-green-500 absolute rounded-full bottom-0 right-0 !z-40' />
						)}
          </div>

          {/* Name + status */}
     
           <div className='ml-3 border-b w-full '>
            <div className="font-medium md:text-[14px] text-[12px] ">{contact?.firstName} {contact?.lastName} .</div>
            <div className="text-[10px] text-slate-400">last seen recently</div>
          </div>
         

          {/* Action button */}
        </div>
      )
      ) : (
        <div className='text-center text-sm text-slate-400 mt-10'>No contacts found</div>
      )}
                            </div>

  

  <Button type='submit' className='w-full' size='lg'>Submit</Button>
        </form>
</Form>


        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    );
};

export default ModalCreateGroup
