import { Metadata } from "next"
import { InvoicesClient } from "@/components/invoices/InvoicesClient"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Invoices | Lab68Dev",
  description: "Manage your time tracking and generate invoices.",
}

export default async function InvoicesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch existing invoices on server if we want, or fetch on client.
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Invoices</h2>
      </div>
      <InvoicesClient initialInvoices={invoices || []} userId={user.id} />
    </div>
  )
}
