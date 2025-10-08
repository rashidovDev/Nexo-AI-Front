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

const DangerZone = () => {
  const form = useForm<z.infer<typeof confirmTextSchema>>({
		resolver: zodResolver(confirmTextSchema),
		defaultValues: { confirmText: '' },
	})
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
        <form onSubmit={form.handleSubmit((data) => console.log(data))} className='space-y-2 mt-4'> 
          <FormField
								control={form.control}
								name='confirmText'
								render={({ field }) => (
									<FormItem>
										<FormDescription>
											Please type <span className='font-bold'>DELETE</span> to confirm.
										</FormDescription>
										<FormControl>
											<Input className='bg-secondary' disabled {...field} />
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
								)}
							/>
          <Button className='w-full font-bold' type='submit' variant='destructive'>
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