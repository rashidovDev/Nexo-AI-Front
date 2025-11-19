import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { confirmTextSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Form,
  FormControl,

  FormDescription,

  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input'
import { generateToken } from '@/lib/generate-token'
import { apiClient } from '@/api/axios'
import { signOut, useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'

const DangerZone = () => {

  const { data: session } = useSession()


  const form = useForm<z.infer<typeof confirmTextSchema>>({
		resolver: zodResolver(confirmTextSchema),
		defaultValues: { confirmText: '' },
	})

	const { mutate, isPending } = useMutation({
  	mutationFn: async () => {
			const token = await generateToken(session?.currentUser)
			const { data } = await apiClient.delete('/user/delete-user', { headers: { Authorization: `Bearer ${token}` } })
			return data
		},
		onSuccess: () => {
			signOut()
		},
	})

	function onSubmit() {
		mutate()
	}
  return (
    <>
    <p className='text-xs text-muted-foreground text-center'> Are you sure you want to delete your account? 
      This action cannot ne undone
    </p>
<Dialog>
  <DialogTrigger asChild>
    <Button className='mt-2 w-full font-spaceGrotesk font-bold' variant='destructive'>
      Delete Account
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <Form {...form}>  
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 mt-4'> 
          <FormField
								control={form.control}
								name='confirmText'
								render={({ field }) => (
									<FormItem>
										<FormDescription>
											Please type <span className='font-bold'>DELETE</span> to confirm.
										</FormDescription>
										<FormControl>
											<Input className='bg-secondary' disabled={isPending} {...field} />
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
								)}
							/>
          <Button disabled={isPending} className='w-full font-bold' type='submit' variant='destructive'>
            I understand, delete my account
          </Button>
        </form>
        </Form>
  </DialogContent>
</Dialog>
</>
  )
}

export default DangerZone