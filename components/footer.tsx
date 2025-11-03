import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm font-mono">© 2025 Lab68dev — Built with passion and code.</p>
          <div className="flex gap-6">
            <Link
              href="https://github.com/lab68dev"
              target="_blank"
              className="text-sm hover:text-primary transition-colors underline"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/company/lab68dev/"
              target="_blank"
              className="text-sm hover:text-primary transition-colors underline"
            >
              LinkedIn
            </Link>
            <Link href="mailto:dongduong840@gmail.com" className="text-sm hover:text-primary transition-colors underline">
              Email
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
