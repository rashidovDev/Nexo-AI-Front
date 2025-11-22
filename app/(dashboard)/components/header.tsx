"use client"

import { apiClient } from '@/api/axios'
import ModeToggle from '@/components/ui/custom/mode-toggle'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { generateToken } from '@/lib/generate-token'
import { connectToDatabase } from '@/lib/mongoose'
import { useSelectedOption } from '@/services/current-option'
import { useDialog } from '@/services/use-dialog'
import { IUser } from '@/types'
import { Search, SquarePen } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const Header = () => {
   const {searchQuery, setSearchQuery} = useSelectedOption()

  const {selectedOption} = useSelectedOption()
  const { setOpenAddContactDialog} = useDialog()
  
  return (
  <div className='mb-2 p-1'>
          <div className='mb-1 flex justify-between items-center '>
            <ModeToggle/>
           <h1 className='capitalize text-center text-lg'>{selectedOption}</h1>
           <SquarePen onClick={() => setOpenAddContactDialog(true)} className='cursor-pointer mr-2' size={15}/>
          </div>
         {/* SEARCH */}
        <div className="relative w-[95%] mx-auto">
        {/* Search Icon */}
        <Search className="absolute  left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
         {/* Input */}
         <Input
         value = {searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className="w-full pl-9 pr-3 py-2 bg-secondary focus-visible:ring-0 border
         rounded-md text-sm placeholder:text-sm !outline-none focus:outline-none outline-transparent"
          />
       </div>
        </div>
  )
}

export default Header