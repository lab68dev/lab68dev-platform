import Image from "next/image"
import Link from "next/link"
import { Github, Instagram, Linkedin, Mail, Youtube } from "lucide-react"

const logoSrc = "/images/design-mode/lab68studio logo.png"

const footerLinks = [
  { label: "Product", href: "/#product" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Stack", href: "/#stack" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

const socialLinks = [
  { icon: Github, href: "https://github.com/lab68dev", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/lab68dev/", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@lab68dev", label: "YouTube" },
  { icon: Instagram, href: "https://www.instagram.com/lab68dev/", label: "Instagram" },
  { icon: Mail, href: "mailto:lab68dev@gmail.com", label: "Email" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[#050505] text-zinc-400">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden border border-white/15 bg-black">
              <Image src={logoSrc} alt="lab68studio logo" fill sizes="40px" className="object-cover" />
            </span>
            <div>
              <div className="text-sm font-bold text-white">lab68studio</div>
              <div className="text-xs text-zinc-300">Open developer workspace</div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-zinc-400 transition-colors hover:border-[#ff7a00]/50 hover:text-white"
              >
                <social.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} lab68studio. All rights reserved.</p>
          <p>Built with Next.js, Supabase, and TypeScript.</p>
        </div>
      </div>
    </footer>
  )
}
