import { LandingClient } from "@/components/landing/LandingClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "lab68studio | Open Developer Workspace",
  description:
    "A practical workspace for developers to plan projects, write docs, manage files, diagram systems, and collaborate.",
}

export default function HomePage() {
  return <LandingClient />
}
