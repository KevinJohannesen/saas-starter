"use client";

import { useState } from "react";
import Link from "next/link";
import { useInvoices } from "../context/invoice-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Send,
  Trash2,
  FileText,
  X,
} from "lucide-react";
import { InvoicePreview } from "../components/invoice-preview";
import type { InvoiceData, InvoiceStatus } from "../types/invoice";

// Helper function for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
  }).format(amount);
};

export function InvoiceDashboard() {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  const calculateSubtotal = (invoice: InvoiceData) => {
    return invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const calculateTax = (invoice: InvoiceData) => {
    return (calculateSubtotal(invoice) * invoice.taxRate) / 100;
  };

  const calculateTotal = (invoice: InvoiceData) => {
    return calculateSubtotal(invoice) + calculateTax(invoice);
  };

  const generatePDF = async (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);

    // Use setTimeout to ensure the preview is rendered before capturing
    setTimeout(async () => {
      const element = document.getElementById("invoice-preview");
      if (!element) return;

      try {
        // Dynamically import html2canvas and jsPDF to avoid SSR issues
        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF } = await import("jspdf");

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Faktura-${invoice.invoiceNumber}.pdf`);

        setPreviewOpen(false);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setPreviewOpen(false);
      }
    }, 500);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Utkast</Badge>;
      case "sent":
        return <Badge variant="secondary">Sendt</Badge>;
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Betalt
          </Badge>
        );
      default:
        return null;
    }
  };

  const getInvoicesByStatus = (status: InvoiceStatus | "all") => {
    if (status === "all") return invoices;
    return invoices.filter((invoice) => invoice.status === status);
  };

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all">Alle ({invoices.length})</TabsTrigger>
          <TabsTrigger value="draft">
            Utkast ({getInvoicesByStatus("draft").length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sendt ({getInvoicesByStatus("sent").length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Betalt ({getInvoicesByStatus("paid").length})
          </TabsTrigger>
        </TabsList>

        {["all", "draft", "sent", "paid"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {getInvoicesByStatus(tab as InvoiceStatus | "all").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg text-gray-500">
                    Ingen fakturaer funnet
                  </p>
                  <Link
                    href="/dashboard/fakturaer/invoice/new"
                    className="mt-4"
                  >
                    <Button>Opprett ny faktura</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Fakturanr.
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Kunde
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Dato
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Forfallsdato
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Beløp
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Handlinger
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {getInvoicesByStatus(tab as InvoiceStatus | "all").map(
                          (invoice) => (
                            <tr
                              key={invoice.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">
                                {invoice.invoiceNumber}
                              </td>
                              <td className="p-4 align-middle">
                                {invoice.toName}
                              </td>
                              <td className="p-4 align-middle">
                                {new Date(invoice.date).toLocaleDateString(
                                  "nb-NO"
                                )}
                              </td>
                              <td className="p-4 align-middle">
                                {new Date(invoice.dueDate).toLocaleDateString(
                                  "nb-NO"
                                )}
                              </td>
                              <td className="p-4 align-middle">
                                {formatCurrency(calculateTotal(invoice))}
                              </td>
                              <td className="p-4 align-middle">
                                {getStatusBadge(invoice.status)}
                              </td>
                              <td className="p-4 align-middle text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Åpne meny</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedInvoice(invoice);
                                        setPreviewOpen(true);
                                      }}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>Forhåndsvis</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => generatePDF(invoice)}
                                    >
                                      <Download className="mr-2 h-4 w-4" />
                                      <span>Last ned PDF</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/dashboard/fakturaer/invoice/edit/${invoice.id}`}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Rediger</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    {invoice.status === "draft" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateInvoiceStatus(
                                            invoice.id,
                                            "sent"
                                          )
                                        }
                                      >
                                        <Send className="mr-2 h-4 w-4" />
                                        <span>Merk som sendt</span>
                                      </DropdownMenuItem>
                                    )}
                                    {invoice.status === "sent" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateInvoiceStatus(
                                            invoice.id,
                                            "paid"
                                          )
                                        }
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        <span>Merk som betalt</span>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => deleteInvoice(invoice.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Slett</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {previewOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto max-w-4xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Forhåndsvisning av faktura</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Lukk</span>
              </Button>
            </div>
            <div className="p-4">
              <InvoicePreview
                invoiceData={selectedInvoice}
                subtotal={calculateSubtotal(selectedInvoice)}
                tax={calculateTax(selectedInvoice)}
                total={calculateTotal(selectedInvoice)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
