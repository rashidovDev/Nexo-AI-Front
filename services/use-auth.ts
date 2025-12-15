import { IUser } from '@/types'
import { create } from 'zustand'

interface State {
  step : 'login' |  'verify' |  "qr"
  setStep : (step : 'login' |  'verify' | 'qr') => void
  email : string    
  setEmail : (email : string) => void
  onlineUsers : IUser[]
  setOnlineUsers : (users : IUser[]) => void
}

export const useAuthStore = create<State>()((set) => ({
    step: 'login',
    setStep: (step) => set({ step }),
    email : '',
    setEmail : (email) => set({ email  }),
    onlineUsers : [],
    setOnlineUsers : (users) => set({ onlineUsers : users  }),
   
}))
