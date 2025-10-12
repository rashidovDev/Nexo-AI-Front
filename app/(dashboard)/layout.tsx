import { authOptions } from '@/lib/auth-option'
import { ChildrenProps } from '@/types'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'

const Layout : FC<ChildrenProps>  = async ({children})  => {
  const session = await getServerSession(authOptions)
  if(!session) redirect('/auth')
  return (
    <>{children}</>
  )
}

export default Layout