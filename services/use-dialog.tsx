import { create } from 'zustand'

interface DialogState {
  openAddContactDialog: boolean
  setOpenAddContactDialog: (open: boolean) => void
}

export const useDialog = create<DialogState>((set) => ({
  openAddContactDialog: false,
  setOpenAddContactDialog: (open) => set({ openAddContactDialog: open }),
}))