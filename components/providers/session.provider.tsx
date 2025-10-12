'use client'

import { ChildrenProps } from '@/types'
import { SessionProvider as Session } from 'next-auth/react'
import { FC } from 'react'

const SessionProvider: FC<ChildrenProps> = ({ children }) => {
	return <Session>{children}</Session>
}

export default SessionProvider