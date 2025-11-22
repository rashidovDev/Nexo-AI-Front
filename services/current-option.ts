import { IMessage } from "@/types";
import { create } from "zustand";

interface State {
    searchQuery : string
    setSearchQuery : (query : string) => void
    selectChatType : 'all' | 'unread' | 'groups' | 'private'
    setSelectChatType : (type : 'all' | 'unread' | 'groups' | 'private') => void
    selectedOption: "chats" | "contacts" | "settings";
    setSelectedOption: (option: "chats" | "contacts" | "settings") => void;
    editedMessage : IMessage | null;
    setEditedMessage : (message : IMessage | null) => void;
}

export const useSelectedOption = create<State>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectChatType: 'all',
  setSelectChatType: (type) => set({ selectChatType : type }),
  selectedOption: "chats", // default value
  setSelectedOption: (option) => set({ selectedOption: option }),
  editedMessage: null,
  setEditedMessage: (message) => set({ editedMessage: message }),
}));