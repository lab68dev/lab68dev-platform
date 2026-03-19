"use client"

import { useState } from "react"
import { createClient } from "@/lib/database/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Printer, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
}

interface Invoice {
  id: string
  user_id: string
  client_name: string
  client_email: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  due_date: string | null
  items: InvoiceItem[]
  created_at: string
}

export function InvoicesClient({ initialInvoices, userId }: { initialInvoices: Invoice[], userId: string }) {
  const supabase = createClient()
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  
  const handleCreateInvoice = async () => {
    const newInvoice = {
      user_id: userId,
      client_name: "New Client",
      client_email: "",
      amount: 0,
      status: 'draft' as const,
      items: [],
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert(newInvoice)
      .select()
      .single()

    if (error) {
      toast.error("Failed to create invoice")
      return
    }

    setInvoices([data, ...invoices])
    setSelectedInvoice(data)
  }

  const handleDeleteInvoice = async (id: string) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (error) {
      toast.error("Failed to delete invoice")
      return
    }
    setInvoices(invoices.filter(inv => inv.id !== id))
    if (selectedInvoice?.id === id) setSelectedInvoice(null)
  }

  const saveInvoice = async (updatedInvoice: Invoice) => {
    const totalAmount = updatedInvoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
    updatedInvoice.amount = totalAmount

    setSelectedInvoice(updatedInvoice)
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv))

    await supabase
      .from('invoices')
      .update({
        client_name: updatedInvoice.client_name,
        client_email: updatedInvoice.client_email,
        amount: updatedInvoice.amount,
        status: updatedInvoice.status,
        due_date: updatedInvoice.due_date,
        items: updatedInvoice.items
      })
      .eq('id', updatedInvoice.id)
  }

  if (selectedInvoice) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between no-print">
          <Button variant="ghost" onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
          <div className="flex gap-2">
             <Button variant="outline" className="border-gray-700 hover:bg-gray-800" onClick={() => window.print()}>
               <Printer className="mr-2 h-4 w-4" /> Print PDF
             </Button>
          </div>
        </div>

        {/* Invoice Paper UI suitable for printing */}
        <div className="bg-white text-black p-10 mx-auto max-w-4xl shadow-xl border border-gray-200 min-h-[800px] print:m-0 print:p-0 print:shadow-none print:border-none">
          <div className="flex justify-between items-start mb-12 border-b pb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tighter">INVOICE</h1>
              <p className="text-gray-500 mt-1 text-sm">#{selectedInvoice.id.split('-')[0].toUpperCase()}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-900">Lab68Dev Platform User</h3>
              <p className="text-gray-500 text-sm">Invoice Date: {new Date(selectedInvoice.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
               <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Billed To</h4>
               <Input 
                 value={selectedInvoice.client_name}
                 onChange={(e) => saveInvoice({...selectedInvoice, client_name: e.target.value})}
                 className="block font-semibold text-lg border-transparent hover:border-gray-300 focus:border-gray-300 p-0 h-auto rounded-none bg-transparent shadow-none"
               />
               <Input 
                 placeholder="client@email.com"
                 value={selectedInvoice.client_email}
                 onChange={(e) => saveInvoice({...selectedInvoice, client_email: e.target.value})}
                 className="block text-gray-600 border-transparent hover:border-gray-300 focus:border-gray-300 p-0 h-auto rounded-none bg-transparent shadow-none text-sm mt-1"
               />
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-gray-900 text-sm uppercase tracking-wider text-gray-600">
                <th className="py-3 font-semibold w-full">Description / Time Log</th>
                <th className="py-3 font-semibold text-right w-24">Hours/Qty</th>
                <th className="py-3 font-semibold text-right w-32">Rate</th>
                <th className="py-3 font-semibold text-right w-32">Amount</th>
                <th className="py-3 w-10 no-print"></th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 last:border-0 group">
                  <td className="py-3 pr-4">
                    <Input 
                       value={item.description}
                       onChange={(e) => {
                          const newItems = [...selectedInvoice.items]
                          newItems[index].description = e.target.value
                          saveInvoice({...selectedInvoice, items: newItems})
                       }}
                       placeholder="e.g. Frontend Development"
                       className="border-transparent hover:border-gray-300 focus:border-gray-300 p-1 h-8 rounded-sm bg-transparent shadow-none w-full"
                     />
                  </td>
                  <td className="py-3">
                    <Input 
                       type="number"
                       value={item.quantity}
                       onChange={(e) => {
                          const newItems = [...selectedInvoice.items]
                          newItems[index].quantity = Number(e.target.value)
                          saveInvoice({...selectedInvoice, items: newItems})
                       }}
                       className="border-transparent hover:border-gray-300 focus:border-gray-300 p-1 h-8 text-right rounded-sm bg-transparent shadow-none w-full"
                     />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end group-focus-within:border-gray-300">
                      <span className="text-gray-400">$</span>
                      <Input 
                        type="number"
                        value={item.rate}
                        onChange={(e) => {
                            const newItems = [...selectedInvoice.items]
                            newItems[index].rate = Number(e.target.value)
                            saveInvoice({...selectedInvoice, items: newItems})
                        }}
                        className="border-transparent hover:border-gray-300 focus:border-gray-300 p-1 h-8 text-right rounded-sm bg-transparent shadow-none w-20"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    ${(item.quantity * item.rate).toFixed(2)}
                  </td>
                  <td className="py-3 text-right no-print">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                          saveInvoice({...selectedInvoice, items: selectedInvoice.items.filter((_, i) => i !== index)})
                     }}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button variant="ghost" className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-gray-900 mb-8 no-print rounded-lg" onClick={() => {
             saveInvoice({...selectedInvoice, items: [...selectedInvoice.items, { id: Date.now().toString(), description: "", quantity: 1, rate: 0 }]})
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add Item / Timelog
          </Button>

          <div className="flex justify-end pt-6 border-t border-gray-200">
             <div className="w-64">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                   <span>Total</span>
                   <span>${selectedInvoice.amount.toFixed(2)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Your Invoices</CardTitle>
        <Button onClick={handleCreateInvoice} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
           <p className="text-sm text-gray-400 text-center py-12">No invoices yet. Click 'Create Invoice' to log your time and bill clients.</p>
        ) : (
           <div className="space-y-3">
             {invoices.map(invoice => (
               <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                  <div className="cursor-pointer flex-1" onClick={() => setSelectedInvoice(invoice)}>
                     <h4 className="font-semibold text-gray-200">{invoice.client_name}</h4>
                     <p className="text-xs text-gray-500">#{invoice.id.split('-')[0].toUpperCase()} • {new Date(invoice.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                     <span className="text-xl font-bold text-gray-200">${invoice.amount.toFixed(2)}</span>
                     <div className="bg-gray-800 px-3 py-1 text-xs rounded-full uppercase tracking-wider text-gray-400 font-semibold w-24 text-center">
                        {invoice.status}
                     </div>
                     <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => handleDeleteInvoice(invoice.id)}>
                       <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
             ))}
           </div>
        )}
      </CardContent>
    </Card>
  )
}
