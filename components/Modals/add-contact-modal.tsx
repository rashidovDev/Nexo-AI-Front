import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { contactSchema } from '@/lib/validation';
import z from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModal } from '@/services/use-modal';

interface Props {
  contactForm: UseFormReturn<z.infer<typeof contactSchema>>
  onCreateContact: (values: z.infer<typeof contactSchema>) => void
}


const ModalAddContact: React.FC <Props> = ({ contactForm, onCreateContact }) => {
    const { setOpenAddContactModal, openAddContactModal} = useModal()
    return (
       <AnimatePresence>
  {openAddContactModal && (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0  z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpenAddContactModal(false)}
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
        <div className=' dark:bg-[#04080F] bg-secondary dark:text-white  md:w-[500px] w-[90%] mx-auto border border-gray-700 rounded-lg p-6 '>
        <h1 className=' font-bold text-2xl'>Add Contact</h1>
        <p className='text-sm text-left dark:'> Fill in contact details below and submit when you&apos;re done.</p>

        <Form {...contactForm} >
						<form onSubmit={contactForm.handleSubmit(onCreateContact)} className='space-y-2 w-full mt-4'>
							<FormField
								control={contactForm.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<Label>Email</Label>
										<FormControl>
											<Input placeholder='Please enter username or email'  className='h-10 bg-secondary' {...field} />
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
								)}
							/>

              
							<Button type='submit' className='w-full' size={'lg'} >
							Add contact
							</Button>
						</form>
					</Form>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    );
};

export default ModalAddContact
