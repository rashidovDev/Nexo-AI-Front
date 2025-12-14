import { ZodVoid } from 'zod/v3'
import { create } from 'zustand'

interface DialogState {
  openAddContactModal: boolean
  setOpenAddContactModal: (open: boolean) => void
  openUploadFileModal: boolean
  setOpenUploadFileModal: (open: boolean) => void
  openCreateGroupModal : boolean
  setOpenCreateGroupModal : (open : boolean) => void
    openContactOwnerModal : boolean
  setOpenContactOwnerModal : (open : boolean) => void
}

export const useModal= create<DialogState>((set) => ({
  openAddContactModal: false,
  setOpenAddContactModal: (open) => set({ openAddContactModal: open }),
  openUploadFileModal: false,
  setOpenUploadFileModal: (open) => set({ openUploadFileModal: open }),
  openCreateGroupModal : false,
  setOpenCreateGroupModal : (open) => set({ openCreateGroupModal : open}),
    openContactOwnerModal : true,
     setOpenContactOwnerModal : (open) => set({ openContactOwnerModal : open})
}))