import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { LiveChatWidget } from "@/components/live-chat-widget"
import { Toaster } from "sonner"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "lab68dev Platform - Build, Learn, Collaborate",
  description:
    "An open developer platform by lab68dev. Empowering developers to build, learn, and collaborate using cutting-edge technologies.",
  icons: {
    icon: [
      {
        url: "/images/design-mode/Lab68dev.ico",
        type: "image/x-icon",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('lab68_theme') || 'dark';
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body 
        className={`${jetbrainsMono.className} font-mono antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
            className: 'font-mono',
          }}
          richColors
          closeButton
        />
        <LiveChatWidget />
      </body>
    </html>
  )
}
