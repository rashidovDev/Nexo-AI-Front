"use client"

import * as React from "react"
import NoSSR from "react-no-ssr"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
  <NoSSR>
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  </NoSSR>
  )
}