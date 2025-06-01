"use client";

import { DashboardHeader } from "./components/dashboard-header";
import { InvoiceDashboard } from "./components/invoice-dashboard";
import { InvoiceProvider } from "./context/invoice-context";

export default function FakturaerPage() {
  return (
    <InvoiceProvider>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fakturaoversikt</h1>
          <p className="text-muted-foreground">
            Administrer og opprett fakturaer for dine prosjekter
          </p>
        </div>
        <DashboardHeader />
        <InvoiceDashboard />
      </div>
    </InvoiceProvider>
  );
}
