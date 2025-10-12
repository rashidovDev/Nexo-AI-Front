import type { Metadata } from "next";
import "./globals.css";
import {Roboto} from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme.provider";
import QueryProvider from "@/components/providers/query.provider";
import { Toaster } from "@/components/ui/toaster";
import { Session } from "inspector/promises";
import SessionProvider from "@/components/providers/session.provider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500","600", "700"],
});

export const metadata: Metadata = {
  title: "Nexo AI",
  description: "AI powered Chat App",
  icons : {
    icon : "/nexo.ico"
  } 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 

  return (
    <SessionProvider>

    <QueryProvider>
    <html lang="en" suppressHydrationWarning>
      <body
      suppressHydrationWarning
        className={`${roboto.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main> 
            <Toaster/> 
          </ThemeProvider>
       
      </body>
    </html>
    </QueryProvider>
    </SessionProvider>
  );
}
