 import { create } from 'zustand'

interface State {
  step : 'login' |  'verify'
  setStep : (step : 'login' |  'verify') => void
  email : string    
  setEmail : (email : string) => void
}

export const useAuthStore = create<State>()((set) => ({
    step: 'login',
    setStep: (step) => set({ step }),
    email : '',
    setEmail : (email) => set({ email  })
}))