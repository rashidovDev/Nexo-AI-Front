import { create } from "zustand";

interface State {
    selectChatType : 'all' | 'unread' | 'groups' | 'private'
    setSelectChatType : (type : 'all' | 'unread' | 'groups' | 'private') => void
    selectedOption: "chats" | "contacts" | "settings";
    setSelectedOption: (option: "chats" | "contacts" | "settings") => void;
}

export const useSelectedOption = create<State>((set) => ({
  selectChatType: 'all',
  setSelectChatType: (type) => set({ selectChatType : type }),
  selectedOption: "chats", // default value
  setSelectedOption: (option) => set({ selectedOption: option }),
}));