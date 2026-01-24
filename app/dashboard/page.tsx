import { redirect } from "next/navigation"
import { getDashboardData } from "@/lib/database/dashboard-server"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data) {
    redirect("/login")
  }

  return (
    <DashboardClient 
      initialUser={data.user} 
      initialCounts={data.counts} 
      initialMeetings={data.upcomingMeetings} 
    />
  )
}
