import type { Metadata } from 'next'
import { Roboto, Open_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/themeProvider'
import { cn } from '@/lib/utils'
import { ModelProvider } from '@/components/providers/modelProvider'
import { SocketProvider } from '@/components/providers/socket-provider'

const inter = Roboto({ weight: ["100", "500", "300", "700", "900"], subsets: ['greek']})

export const metadata: Metadata = {
  title: 'Discord',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <ClerkProvider>
     <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-white dark:bg-[#313338]")}>
       <ThemeProvider             
       attribute="class"
       defaultTheme="dark"
       enableSystem={true}
       storageKey='discord-theme'
      >
        <SocketProvider>
        <ModelProvider />
        {children}
        </SocketProvider>
       </ThemeProvider>
      </body>
     </html>
    </ClerkProvider>
  )
}
