import { cn } from "@/lib/utils";
import { useSelectedOption } from "@/services/current-option";
import { MessagesSquare,Folder,MessageSquareDot,UsersRound, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { set } from "zod";

const items = [
  { icon: MessagesSquare, label: "All chats", name : 'all' },
  { icon: Folder, label: "Private",   name : 'private' },
  { icon: UsersRound, label: "Groups",  name : 'groups' },
  { icon: MessageSquareDot, label: "Unread" ,   name : 'unread' },
];

export default function Leftbar() {



  const { selectChatType, setSelectChatType,setSelectedOption, selectedOption, unreadChatCount} = useSelectedOption()
  return (
    <div className="flex w-full justify-between md:flex-col items-center md:mt-4">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            setSelectedOption('chats');
    setSelectChatType(item.name as 'all' | 'unread' | 'groups' | 'private')
          } }
          className={cn("flex flex-col justify-center items-center hover:text-primary text-[10px] md:mb-4  cursor-pointer  transition-colors", selectChatType === item.name && 'text-primary') }
        >
          {/* Render icon dynamically */}
          <item.icon size={22} className="hidden md:block" />
          <div className="flex items-center">
        <p className="md:text-[10px] text-[15px] ">{item.label}</p> 
{unreadChatCount !== null && unreadChatCount > 0 &&  item.name !== 'groups' && (
  <span
    className={cn(
      "ml-2 min-w-[16px] h-[16px] px-1 rounded-full dark:text-white text-slate-800 bg-secondary text-[10px]  flex items-center justify-center md:hidden",
      selectChatType === "unread" && "bg-primary "
    )}
  >
    {unreadChatCount}
  </span>
)}
      
          </div>
        
        </div>

        
      ))}
     
    </div>
  );
}