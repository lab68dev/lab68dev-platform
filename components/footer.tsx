import Link from "next/link"
import { Github, Linkedin, Instagram, Facebook, Mail, Code2, Youtube, ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full bg-black text-gray-300 overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        
        {/* Newsletter Section */}
        <div className="mb-20">
          <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden group">
            {/* Hover Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-xl">
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ecosystem</span>
                </h3>
                <p className="text-gray-400">
                  Get the latest dev tools, tutorials, and community updates delivered straight to your inbox. No spam, just code.
                </p>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <Input 
                  type="email" 
                  placeholder="enter.your@email.com" 
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 h-11 w-full sm:w-80 transition-all font-mono text-sm"
                />
                <Button className="h-11 bg-white text-black hover:bg-gray-200 font-semibold px-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="p-2 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                <Code2 className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">lab68dev</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Empowering developers to build, learn, and collaborate. An open-source initiative crafting the next generation of developer tools.
            </p>
            <div className="flex items-center gap-3">
               {[
                 { icon: Github, href: "https://github.com/lab68dev", label: "Github" },
                 { icon: Linkedin, href: "https://www.linkedin.com/company/lab68dev/", label: "LinkedIn" },
                 { icon: Youtube, href: "https://www.youtube.com/@lab68dev", label: "YouTube" },
                 { icon: Instagram, href: "https://www.instagram.com/lab68dev/", label: "Instagram" },
               ].map((social) => (
                 <Link
                   key={social.label}
                   href={social.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label={social.label}
                   className="p-2 border border-white/5 bg-white/5 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-110 text-gray-400 hover:text-white transition-all duration-300"
                 >
                   <social.icon className="h-4 w-4" />
                 </Link>
               ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <h4 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-3">
                {["Dashboard", "Projects", "Community", "AI Tools"].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`/dashboard/${item.toLowerCase().replace(' ', '-')}`} 
                      className="text-sm text-gray-500 hover:text-blue-400 transition-colors flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 -ml-4 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2 text-blue-500" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h4 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                {[
                  { label: "Documentation", href: "#" },
                  { label: "API Reference", href: "#" },
                  { label: "GitHub Repo", href: "https://github.com/lab68dev/lab68dev-platform" },
                  { label: "Open Source", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                     <Link 
                      href={item.href} 
                      className="text-sm text-gray-500 hover:text-purple-400 transition-colors flex items-center group"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 3 */}
            <div className="space-y-4">
              <h4 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {["About", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                     <Link 
                      href="#" 
                      className="text-sm text-gray-500 hover:text-pink-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              <h4 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Cookies", "Licenses"].map((item) => (
                  <li key={item}>
                     <Link 
                      href={`/${item.toLowerCase()}`} 
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <Separator className="bg-white/5 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-mono">
          <p>
            © {currentYear} Lab68Dev Platform. All code is open source.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gray-400 transition-colors flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Nominal
            </Link>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
