"use client"

import ModeToggle from '@/components/ui/custom/mode-toggle'
import { Input } from '@/components/ui/input'
import { useSelectedOption } from '@/services/current-option'
import { Search, SquarePen } from 'lucide-react'
import React from 'react'

const Header = () => {

  const {selectedOption} = useSelectedOption()
  
  return (
  <div className='mb-2 p-1'>
          <div className='mb-1 flex justify-between items-center '>
            <ModeToggle/>
           <h1 className='capitalize text-center text-lg'>{selectedOption}</h1>
           <SquarePen className='cursor-pointer mr-2' size={15}/>
          </div>
         {/* SEARCH */}
        <div className="relative w-[95%] mx-auto">
        {/* Search Icon */}
        <Search className="absolute  left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
         {/* Input */}
         <Input
        placeholder="Search"
        className="w-full pl-9 pr-3 py-2 bg-secondary focus-visible:ring-0 border
         rounded-md text-sm placeholder:text-sm !outline-none focus:outline-none outline-transparent"
          />
       </div>
        </div>
  )
}

export default Header