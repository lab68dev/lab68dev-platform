import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "lab68studio - Open Developer Workspace",
  description:
    "An open developer workspace for planning projects, writing docs, managing files, diagramming systems, and collaborating.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/images/design-mode/favicon.ico",
        type: "image/x-icon",
        sizes: "64x64",
      },
      {
        url: "/icons/icon-192.svg",
        type: "image/svg+xml",
        sizes: "192x192",
      },
    ],
    apple: [
      { url: "/icons/icon-192.svg", sizes: "192x192" },
    ],
    shortcut: [{ url: "/images/design-mode/favicon.ico" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
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
                  var isLocalDev = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
                  if (isLocalDev && 'serviceWorker' in navigator) {
                    var cleanupKey = 'lab68_sw_cleaned_v4';
                    var cleanup = function() {
                      var cleanupServiceWorkers = navigator.serviceWorker.getRegistrations()
                        .then(function(registrations) {
                          return Promise.all(registrations.map(function(registration) {
                            return registration.unregister();
                          }));
                        })
                        .catch(function() {});
                      var cleanupCaches = window.caches
                        ? caches.keys()
                          .then(function(names) {
                            return Promise.all(names.map(function(name) {
                              return caches.delete(name);
                            }));
                          })
                          .catch(function() {})
                        : Promise.resolve();
                      return Promise.all([cleanupServiceWorkers, cleanupCaches]);
                    };
                    cleanup().finally(function() {
                      if (navigator.serviceWorker.controller && sessionStorage.getItem(cleanupKey) !== '1') {
                        sessionStorage.setItem(cleanupKey, '1');
                        window.location.reload();
                      }
                    });
                  }
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
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <CookieConsentBanner />
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  var isLocalDev = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
                  if (isLocalDev) {
                    return;
                  }
                  sessionStorage.removeItem('lab68_sw_cleaned_v4');
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
