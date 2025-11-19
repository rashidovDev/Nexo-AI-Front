import React, { FC, useEffect } from 'react'
import { IUser } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useCurrentChatUser } from '@/services/current-chat'
import { useSelectedOption } from '@/services/current-option'
import { apiClient } from '@/api/axios'
import { generateToken } from '@/lib/generate-token'
import { useSession } from 'next-auth/react'

interface Props {
    contacts : IUser[]
}

const SearchUser : FC  = () => {

     const {searchQuery} = useSelectedOption()
    const [userData, setUserData] = React.useState<IUser | null>(null)
const { data: session } =  useSession()

  const {currentChatUser, setCurrentChatUser} = useCurrentChatUser()
  const router = useRouter()

  const searchByUsername = async () => {
    try {
    const token = await generateToken(session?.currentUser)
    const { data } = await apiClient.get(`/user?search=${searchQuery}`, { headers: { Authorization: `Bearer ${token}` } })
    setUserData(data)
    console.log("SEARCH DATA",data)
    return data
     } catch (error) {
      return null
     }
  }

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchQuery.trim() !== "") {
      searchByUsername();
    }
  }, 500); // wait 500ms after typing stops

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

  const selectChat = (chat : IUser) => {
        console.log('chat selected', chat._id)
        if(currentChatUser?._id === chat._id) return;
        setCurrentChatUser(chat)
       router.push(`/?chat=${chat._id}`)
    }

  return (
  <div 

  className="cursor-pointer">
     {userData ? (
  <div
    onClick={() => selectChat(userData)}
    key={String(userData._id)}
    className='flex items-center h-10 my-2 px-1'
  >
    <Avatar className='w-9 h-9'>
      <AvatarImage src={userData?.userImage?.url} alt={userData.email} className='object-cover'/>
      <AvatarFallback className='uppercase'>{userData.firstName}</AvatarFallback>
    </Avatar>
    <div className='ml-3 border-b w-full '>
      <div className="font-medium">{userData.firstName} {userData.lastName}</div>
      <div className="text-sm text-slate-400">last seen recently</div>
    </div>
  </div>
) : (
  <div className='text-center text-sm text-slate-400 mt-10'>No user found</div>
)}
    </div>
  )
}

export default SearchUser