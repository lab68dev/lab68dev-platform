"use client"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-muted flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m12.728 0L5.636 18.364"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3">You&apos;re Offline</h1>
        <p className="text-muted-foreground mb-8">
          It looks like you&apos;ve lost your internet connection. Some features may be unavailable.
          Your local changes will sync automatically when you&apos;re back online.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
