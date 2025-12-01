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

    const router = useRouter()

  const { selectChatType, setSelectChatType,setSelectedOption, selectedOption} = useSelectedOption()
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
        <p className="md:text-[10px] text-[15px]  ">{item.label}</p> <span className={cn("ml-2 w-4 h-4 rounded-full bg-secondary flex items-center justify-center md:hidden", selectChatType === item.name && 'text-white bg-primary')}  >1</span>
          </div>
        
        </div>

        
      ))}
      {/* <div
        onClick={() => router.push("/qr/camera")}
        className="flex flex-col justify-center items-center hover:text-green-500 text-[10px] mt-6 cursor-pointer transition-colors"
      >
        <QrCode size={24} />
        <p className="text-[10px] mt-1">Scan QR</p>
      </div> */}
    </div>
  );
}