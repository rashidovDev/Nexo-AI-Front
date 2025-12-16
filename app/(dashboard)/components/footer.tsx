"use client"
import { IoIosChatbubbles } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelectedOption } from "@/services/current-option";
import { cn } from "@/lib/utils";

const icons = [
  { id: 1, name: "chats", icon: IoIosChatbubbles },
  { id: 2, name: "contacts", icon: FaRegUserCircle },
  { id: 3, name: "settings", icon: IoSettingsOutline },
];

const Footer = () => {
  const { selectedOption, setSelectedOption } = useSelectedOption();

  return (
    <div
      className="
        fixed md:absolute
        bottom-0
        w-full
        z-50
        flex justify-around items-center
        h-[6svh]
        border-t md:bg-transparent bg-background
        "
    >
      {icons.map(({ id, name, icon: Icon }) => (
        <div
          key={id}
          onClick={() =>
            setSelectedOption(name as "chats" | "contacts" | "settings")
          }
          className={cn(
            "flex flex-col items-center cursor-pointer transition-colors",
            selectedOption === name
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Icon size={22} />
        </div>
      ))}
    </div>
  );
};

export default Footer;

