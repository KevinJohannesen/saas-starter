"use client";

import { InvoiceProvider } from "../../../context/invoice-context";
import { InvoiceGenerator } from "../../../components/invoice-generator";
import { DashboardHeader } from "../../../components/dashboard-header";

export default function EditInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <InvoiceProvider>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rediger faktura</h1>
          <p className="text-muted-foreground">
            Gjør endringer i din eksisterende faktura
          </p>
        </div>
        <InvoiceGenerator invoiceId={params.id} />
      </div>
    </InvoiceProvider>
  );
}
