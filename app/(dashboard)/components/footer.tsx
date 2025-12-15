"use client"
import { IoIosChatbubbles } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

import React from 'react'
import { useSelectedOption } from "@/services/current-option";
import { id } from "zod/v4/locales";
import { cn } from "@/lib/utils";

const icons = [
  {id: 1, name: 'chats', icon: IoIosChatbubbles},
  {id: 2, name: 'contacts', icon: FaRegUserCircle},
  {id: 3, name: 'settings', icon: IoSettingsOutline}
]


const Footer = () => {
  const {selectedOption,setSelectedOption} = useSelectedOption()
  return (
    <div className='absolute  bottom-0 flex justify-around items-center w-full h-[6svh] border-t'>
        {
          icons.map(({id, name, icon: Icon}) => (
            <div key={id} onClick={() => setSelectedOption(name.toLowerCase() as 'chats' | 'contacts' | 'settings')}
             className={cn(`flex flex-col justify-center items-center cursor-pointer hover:text-primary transition-colors`, 
             selectedOption === name && "text-primary") }>
              <Icon size={20}/>
              {/* <p className={cn('text-[10px] mt-1', selectedOption === name && "text-white") }>{name}</p> */}
            </div>
          ))
        }
    </div>
  )
}

export default Footer