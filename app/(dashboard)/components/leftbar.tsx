import { cn } from "@/lib/utils";
import { useSelectedOption } from "@/services/current-option";
import { MessagesSquare,Folder,MessageSquareDot,UsersRound } from "lucide-react";

const items = [
  { icon: MessagesSquare, label: "All chats", name : 'all' },
  { icon: Folder, label: "Private",   name : 'private' },
  { icon: UsersRound, label: "Groups",  name : 'groups' },
  { icon: MessageSquareDot, label: "Unread" ,   name : 'unread' },
];

export default function Leftbar() {

  const { selectChatType, setSelectChatType} = useSelectedOption()
  return (
    <div className="flex flex-col items-center mt-4">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => setSelectChatType(item.name as 'all' | 'unread' | 'groups' | 'private')}
          className={cn("flex flex-col justify-center items-center hover:text-primary text-[10px] mb-4 cursor-pointer  transition-colors", selectChatType === item.name && 'text-primary') }
        >
          {/* Render icon dynamically */}
          <item.icon size={22} className="" />
          <p className="text-[10px] mt-1 ">{item.label}</p>
        </div>
      ))}
    </div>
  );
}