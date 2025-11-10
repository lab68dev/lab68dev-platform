import Link from "next/link"
import { Github, Linkedin, Instagram, Facebook, Mail, Code2 } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">lab68dev</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the future of collaborative development platforms.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/dashboard/ai-tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link href="/dashboard/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/lab68dev" target="_blank" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/lab68dev" target="_blank" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="https://github.com/lab68dev/lab68dev-platform" target="_blank" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link href="mailto:lab68dev@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
            <div className="flex gap-4">
              <Link
                href="https://github.com/lab68dev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/lab68dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/lab68dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.facebook.com/groups/lab68dev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:lab68dev@gmail.com"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Subscribe to our newsletter for updates and insights.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} lab68dev. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/staff/login" className="text-muted-foreground hover:text-primary transition-colors">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
