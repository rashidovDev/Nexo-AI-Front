import React, { FC, useCallback, useEffect } from "react"
import { IChat, IUser } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useCurrentChatUser } from "@/services/current-chat"
import { useSelectedOption } from "@/services/current-option"
import { apiClient } from "@/api/axios"
import { generateToken } from "@/lib/generate-token"
import { useSession } from "next-auth/react"

const SearchUser: FC = () => {
  const { searchQuery } = useSelectedOption()
  const [userResults, setUserResults] = React.useState<IUser[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const { data: session } = useSession()

  const { currentChatUser, setCurrentChatUser, setCurrentChatId } = useCurrentChatUser()
  const router = useRouter()

  const searchByUsername = useCallback(async (query: string): Promise<IUser[]> => {
    try {
      const token = await generateToken(session?.currentUser)
      const { data } = await apiClient.get<{ users: IUser[] }>(`/user?search=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return data?.users ?? []
    } catch {
      return []
    }
  }, [session?.currentUser])

  useEffect(() => {
    const query = searchQuery.trim()

    if (!query || !session?.currentUser) {
      setUserResults([])
      setIsSearching(false)
      return
    }

    let isActive = true
    setIsSearching(true)
    const delayDebounce = setTimeout(async () => {
      const data = await searchByUsername(query)
      if (!isActive) return
      setUserResults(data)
      setIsSearching(false)
    }, 500)

    return () => {
      isActive = false
      clearTimeout(delayDebounce)
    }
  }, [searchQuery, session?.currentUser, searchByUsername])

  const createOrFetchChat = async (userId: string): Promise<IChat | null> => {
    try {
      const token = await generateToken(session?.currentUser)
      const { data } = await apiClient.post<IChat>(
        "/chat/create-dm",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return data
    } catch {
      return null
    }
  }

  const selectChat = async (user: IUser) => {
    if (currentChatUser?._id === user._id) return
    const dm = await createOrFetchChat(String(user._id))
    if (!dm) return
    setCurrentChatUser(user)
    setCurrentChatId(dm._id)
    router.push(`/?chat=${dm._id}`)
  }

  const trimmedQuery = searchQuery.trim()

  if (!trimmedQuery) {
    return null
  }

  return (
    <div className="cursor-pointer">
      {isSearching ? (
        <div className="text-center text-sm text-slate-400 mt-10">Searching…</div>
      ) : userResults.length > 0 ? (
        userResults.map((user) => (
          <div onClick={() => selectChat(user)} key={String(user._id)} className="flex items-center h-12 my-2 px-1">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.userImage?.url} alt={user.email} className="object-cover" />
              <AvatarFallback className="uppercase">{user.firstName}</AvatarFallback>
            </Avatar>
            <div className="ml-3 border-b w-full ">
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-slate-400 lowercase">{user.username || user.email}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-slate-400 mt-10">No user found</div>
      )}
    </div>
  )
}

export default SearchUser
