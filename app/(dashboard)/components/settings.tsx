"use client"
import { apiClient } from '@/api/axios'
import DangerZoneForm from '@/components/forms/danger.zone'
import EmailForm from '@/components/forms/email.form'
import InformationForm from '@/components/forms/information.form'
import NotificationForm from '@/components/forms/notification.form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { generateToken } from '@/lib/generate-token'
import { useMutation } from '@tanstack/react-query'
import { Camera, ChevronRight, Delete, LogIn, Moon, Plus, Sun, Trash, Upload, VolumeOff } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UploadButton, UploadDropzone } from '@/lib/uploadthing'


const Settings = () => {

  const [file, setFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

   const {data : session, update} =  useSession()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
	  const token = await generateToken(session?.currentUser)
      const  data  = await apiClient.post('/user/upload-image', formData, { headers: { Authorization: `Bearer ${token}`,
		 "Content-Type": "multipart/form-data", } })
	  if(data){
		toast({ description: 'Image uploaded successfully' })
		update()
	  }
      console.log("Uploaded image URL:", data); // Backend should return the Cloudinary URL
    } catch (err) {
      console.error(err);
    }
  };
	
  const [openItem, setOpenItem] = useState("info") // default open
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [muted, setMuted] = useState(session?.currentUser?.muted ?? false)

  useEffect(() => {
  // keep local state in sync when session updates
  setMuted(session?.currentUser?.muted ?? false)
}, [session?.currentUser?.muted])

  	const { mutate, isPending } = useMutation({
		mutationFn: async (muted : boolean) => {
			const token = await generateToken(session?.currentUser)
			const { data } = await apiClient.put('/user/edit-profile', {muted}, { headers: { Authorization: `Bearer ${token}` } })
			return data
		},
		 onMutate: async (newMuted) => {
    // ✅ optimistic update: change UI instantly
    setMuted(newMuted)
  },
		onSuccess: () => {
			toast({ description: 'Profile updated successfully' })
			update()
		},
	})

  return (
    <div className='px-3'>

     <div className='flex items-center justify-between mb-5 cursor-pointer' onClick={() => setIsProfileOpen(true)}>
      <div className='flex items-center'>
        
      <Avatar className='w-12 h-12'>
						<AvatarImage src={session?.currentUser?.userImage?.url} alt={session?.currentUser?.email}  className='object-cover' />
							<AvatarFallback className='text-xl uppercase font-spaceGrotesk'>A</AvatarFallback>
						</Avatar>
            <div className='ml-3'>
          <h1 className='text-md font-spaceGrotesk font-semibold'>
		    	{session?.currentUser?.firstName} {session?.currentUser?.lastName}</h1>
          <p className='text-[12px] text-muted-foreground'>{session?.currentUser?.email}</p>
            </div>
      </div>
            <div>
              <ChevronRight size={16}/>
            </div>
     </div>

      {/* <UploadButton
      endpoint="imageUploader"

      onClientUploadComplete={(res) => {
        console.log("Upload success:", res)
      }}
      config={{ appendOnPaste: true, mode: 'auto' }}
      appearance={{ allowedContent: { display: 'none' }, button: { width: 40, height: 40, borderRadius: '100%' } }}
      	content={{ button: <Upload size={16} /> }}
      onUploadError={(err) => {
        alert("Upload error: " + err.message)
      }}
    /> */}


     <div className='flex justify-between items-center p-2 hover:bg-secondary rounded-md  my-2'>
       <div className='flex items-center gap-1'>
         <VolumeOff size={16}/>
         <span className='text-sm'>Mute</span>
       </div>
       <Switch 
	checked={muted}
  onCheckedChange={(checked) => mutate(checked)}
  disabled={isPending}
	   />
     </div>

     <div className='flex justify-between items-center p-2 hover:bg-secondary rounded-md my-2'>
							<div className='flex items-center gap-1'>
								{resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
								<span className='text-sm'>{resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
							</div>
							<Switch
								checked={resolvedTheme === 'dark' ? true : false}
								onCheckedChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
							/>
						</div>

     <div 
	 onClick={() => signOut()}
	 className='flex justify-between items-center bg-destructive p-2 cursor-pointer rounded-md my-2' >
							<div className='flex items-center gap-1'>
								<LogIn size={16} className='text-white' />
								<span className='text-sm  text-white'>Logout</span>
							</div>
						</div>

    <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
		<SheetContent side={'left'} className='md:w-[350px] w-full p-2 max-md:w-full'>
				<SheetHeader>
						<SheetTitle className='text-2xl'>My profile</SheetTitle>
						<SheetDescription>
							Setting up your profile will help you connect with your friends and family easily.
						</SheetDescription>
					</SheetHeader>

					<Separator className='my-2' />
					<div className='mx-auto w-1/2 max-md:w-1/4 h-36 relative'>
	<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <form>
    <DialogTrigger asChild>
      <Button
        onClick={() => setDialogOpen(true)}
        className={cn(
          `absolute w-7 h-7 rounded-full flex justify-center items-center
          bg-blue-500 z-50 -bottom-2 right-2 cursor-pointer`,
          session?.currentUser?.userImage
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500'
        )}
      >
        {session?.currentUser?.userImage ? (
          <Trash size={12} />
        ) : (
          <Camera size={12} />
        )}
      </Button>
    </DialogTrigger>

    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {session?.currentUser?.userImage ? "Delete Image" : "Upload Image"}
        </DialogTitle>
      </DialogHeader>

      {session?.currentUser?.userImage ? (
        <div>Are you sure you want to delete your profile photo?</div>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Input
              className="cursor-pointer"
              onChange={handleChange}
              type="file"
              name="file"
            />
          </div>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button className='mt-3 md:mt-0' variant="outline">Cancel</Button>
        </DialogClose>

        {session?.currentUser?.userImage ? (
          <Button
            onClick={async () => {
              try {
                const token = await generateToken(session?.currentUser)
                await apiClient.delete('/user/delete-image', {
                  headers: { Authorization: `Bearer ${token}` },
                })
                toast({ description: 'Image deleted successfully' })
                update()
                setDialogOpen(false) // 👈 close after success
              } catch (err) {
                console.error(err)
              }
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete image
          </Button>
        ) : (
          <Button
            onClick={async () => {
              await handleUpload()
              setDialogOpen(false) // 👈 close after upload
            }}
          >
            Upload image
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  </form>
</Dialog>

<div className='flex justify-center items-center'>

					<Avatar className='w-36 h-36 rounded-full overflow-hidden'>
  <AvatarImage 
    src={session?.currentUser?.userImage?.url} 
    alt={session?.currentUser?.email}  
    className='object-cover w-full h-full rounded-full'
  />
  <AvatarFallback className='text-6xl uppercase font-spaceGrotesk rounded-full flex items-center justify-center'>
    {session?.currentUser?.firstName
      ? session?.currentUser?.firstName.charAt(0)
      : session?.currentUser?.email?.charAt(0)}
  </AvatarFallback>
</Avatar>
</div>
</div>
					
    <Accordion type='single'      value={openItem}
      onValueChange={setOpenItem} collapsible className='mt-4'>
						<AccordionItem value='item-1'>
							<AccordionTrigger className='bg-secondary px-2'>Basic information</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<InformationForm setOpenItem={setOpenItem}/>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='item-2' className='mt-2'>
							<AccordionTrigger className='bg-secondary px-2'>Email</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<EmailForm />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='item-3' className='mt-2'>
							<AccordionTrigger className='bg-secondary px-2'>Notification</AccordionTrigger>
							<AccordionContent className='mt-2'>
								<NotificationForm />
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='item-4' className='mt-2'>
							<AccordionTrigger className='bg-secondary px-2'>Danger zone</AccordionTrigger>
							<AccordionContent className='my-2 px-2'>
								<DangerZoneForm />
							</AccordionContent>
						</AccordionItem>
				     	</Accordion>

					
				</SheetContent> 
			</Sheet>



    </div>
  )
}

export default Settings