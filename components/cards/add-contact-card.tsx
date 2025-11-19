"use client"
import React, { FC } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useDialog } from "@/services/use-dialog"
import { UseFormReturn } from "react-hook-form"
import z from "zod"
import { contactSchema } from "@/lib/validation"

interface Props {
  contactForm: UseFormReturn<z.infer<typeof contactSchema>>
  onCreateContact: (values: z.infer<typeof contactSchema>) => void
}


const AddContactCard: FC<Props> = ({ contactForm, onCreateContact }) => {
  
  const { openAddContactDialog, setOpenAddContactDialog } = useDialog()
  // const {data : session, update} =  useSession()

  // const { mutate, isPending } = useMutation({
	// 	mutationFn: async (payload : z.infer<typeof contactSchema>) => {
	// 		const token = await generateToken(session?.currentUser)
	// 		const { data } = await apiClient.post('/user/create-contact', {payload}, { headers: { Authorization: `Bearer ${token}` } })
	// 		return data
  // },
	// 	onSuccess: () => {
	// 		toast({ description: 'Profile updated successfully' })
	// 		update()
	// 	},
	// })

  return (
    

    <Dialog open={openAddContactDialog} onOpenChange={setOpenAddContactDialog} >

      <DialogContent className="w-full max-w-[calc(100%-2rem)] mx-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogDescription>
            Fill in contact details below and click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Only ONE form — this is the actual controlled one */}
        <Form {...contactForm}>
						<form onSubmit={contactForm.handleSubmit(onCreateContact)} className='space-y-2 w-full'>
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
								Submit
							</Button>
						</form>
					</Form>
      </DialogContent>
    </Dialog>

  )
}

export default AddContactCard
