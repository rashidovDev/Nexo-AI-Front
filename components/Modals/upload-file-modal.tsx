import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { messageSchema } from '@/lib/validation';
import z from 'zod';

import { useModal } from '@/services/use-modal';
import { UploadDropzone } from '@/lib/uploadthing';
import { toast } from '@/hooks/use-toast';

interface Props {
 onSubmitMessage : (value : z.infer <typeof messageSchema>) => void
}


const ModalUploadFile: React.FC <Props> = ({ onSubmitMessage}) => {
    const { setOpenUploadFileModal, openUploadFileModal} = useModal()
    return (
       <AnimatePresence>
  {openUploadFileModal && (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0  z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpenUploadFileModal(false)}
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
        <div className=' dark:bg-[#04080F] bg-secondary md:w-[500px] w-[80%] mx-auto border border-gray-700 rounded-lg p-5 z-30'>
        {/* <h1 className='text-lg font-semibold'>Add Contact</h1>
        <p className='text-sm text-left'> Fill in contact details below and submit when you're done.</p> */}

        <div>
            <UploadDropzone 
            endpoint={'imageUploader'}
            onClientUploadComplete={res => {
                onSubmitMessage({text : '', image: res[0].url })
                setOpenUploadFileModal(false)
            }}
           config={{ appendOnPaste: true, mode: 'auto' }}
             appearance={{  button: { cursor : "pointer" } }}
           onUploadError={(err) => {
            toast({ description: 'Upload failed. Please try again.', variant: 'destructive' })
      }}
            />
        </div>

        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    );
};

export default ModalUploadFile