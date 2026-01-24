import { LandingClient } from "@/components/landing/LandingClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lab68Dev | Modern Collaboration Platform",
  description: "Think. Code. Test. Ship. The ultimate platform for developers who build, learn, and collaborate.",
}

export default function HomePage() {
  return <LandingClient />
}