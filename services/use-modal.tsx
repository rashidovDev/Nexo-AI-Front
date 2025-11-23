import { create } from 'zustand'

interface DialogState {
  openAddContactModal: boolean
  setOpenAddContactModal: (open: boolean) => void
  openUploadFileModal: boolean
  setOpenUploadFileModal: (open: boolean) => void
}

export const useModal= create<DialogState>((set) => ({
  openAddContactModal: false,
  setOpenAddContactModal: (open) => set({ openAddContactModal: open }),
  openUploadFileModal: false,
  setOpenUploadFileModal: (open) => set({ openUploadFileModal: open }),
}))