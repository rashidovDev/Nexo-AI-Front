"use client"
import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChildrenProps } from '@/types';

const queryClient = new QueryClient();

const QueryProvider : FC <ChildrenProps>  = ({children}) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider 