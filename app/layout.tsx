import type { Metadata } from "next";
import "./globals.css";
import {Roboto} from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme.provider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500","600", "700"],
});

export const metadata: Metadata = {
  title: "Nexo AI",
  description: "AI powered Chat App",
  icons : {
    icon : "/nexo.png"
  } 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             {children}
          </ThemeProvider>
       
      </body>
    </html>
  );
}
