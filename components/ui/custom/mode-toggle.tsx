"use client"

import React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"


const ModeToggle = () => {
const {setTheme, resolvedTheme} = useTheme()
  return resolvedTheme  === 'dark' ? 
  <Button size={'icon'} variant={"ghost"} onClick={() => setTheme('light')}><Sun/></Button> :
  <Button size={"icon"} variant={"ghost"} onClick={() => setTheme('dark')}><Moon/></Button> 
}

export default ModeToggle