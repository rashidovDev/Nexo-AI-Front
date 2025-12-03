 import { IMessage, IUser } from '@/types'
import { create } from 'zustand'

interface State {
  currentChatId : string | null
  setCurrentChatId : (id : string | null) => void
  currentChatUser : IUser | null
  setCurrentChatUser : (chat : IUser | null) => void
  editedMessage: IMessage | null
	setEditedMessage: (message: IMessage | null) => void

}

export const useCurrentChatUser = create<State>()((set) => ({
     currentChatId : null,
     setCurrentChatId : (id) => set({currentChatId : id}),
    currentChatUser: null,
    setCurrentChatUser: (chat) => set({ currentChatUser : chat  }),
    editedMessage: null,
	setEditedMessage: message => set({ editedMessage: message }),

}))