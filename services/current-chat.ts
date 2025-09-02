 import { IUser } from '@/types'
import { create } from 'zustand'

interface State {

  currentChatUser : IUser | null
  setCurrentChatUser : (chat : IUser | null) => void
}

export const useCurrentChatUser = create<State>()((set) => ({

    currentChatUser: null,
    setCurrentChatUser: (chat) => set({ currentChatUser : chat  })
}))