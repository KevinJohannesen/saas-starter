"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";
import { useInvoices } from "../context/invoice-context";
import type { InvoiceData } from "../types/invoice";

interface InvoiceGeneratorProps {
  invoiceId?: string;
}

export function InvoiceGenerator({ invoiceId }: InvoiceGeneratorProps) {
  const { addInvoice, updateInvoice, getInvoiceById } = useInvoices();
  const router = useRouter();

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    id: "",
    invoiceNumber: "FAKTURA-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    reference: "",
    fromName: "Ditt Firma",
    fromEmail: "din@firma.no",
    fromAddress: "Bedriftsgata 123\nOslo, Norge",
    toName: "Kundens Navn",
    toEmail: "kunde@eksempel.no",
    toAddress: "Kundegata 456\nOslo, Norge",
    items: [
      {
        id: "1",
        description: "Tjeneste",
        quantity: 1,
        price: 100,
      },
    ],
    notes: "Takk for handelen!",
    taxRate: 25,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logo: undefined,
    createdBy: "current-user",
    assignedTo: "current-user",
  });

  // Load invoice data if editing
  useEffect(() => {
    if (invoiceId) {
      const invoice = getInvoiceById(invoiceId);
      if (invoice) {
        setInvoiceData(invoice);
      } else {
        router.push("/dashboard/fakturaer");
      }
    } else {
      // Generate a new ID for a new invoice
      setInvoiceData((prev) => ({
        ...prev,
        id: crypto.randomUUID(),
      }));
    }
  }, [invoiceId, getInvoiceById, router]);

  const generatePDF = async () => {
    const element = document.getElementById("invoice-preview");
    if (!element) return;

    try {
      // Dynamically import to avoid SSR issues
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
      pdf.save(`Faktura-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const calculateTax = () => {
    return (calculateSubtotal() * invoiceData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const updatedInvoice = {
      ...invoiceData,
      updatedAt: now,
    };

    if (invoiceId) {
      updateInvoice(updatedInvoice);
    } else {
      addInvoice({
        ...updatedInvoice,
        createdAt: now,
      });
    }

    router.push("/dashboard/fakturaer");
  };

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="form">Rediger Faktura</TabsTrigger>
        <TabsTrigger value="preview">Forhåndsvisning</TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <Card className="p-6">
          <InvoiceForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />
          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/fakturaer")}
            >
              Avbryt
            </Button>
            <Button onClick={handleSave}>
              {invoiceId ? "Oppdater faktura" : "Lagre faktura"}
            </Button>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="preview">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl bg-white mb-6">
            <InvoicePreview
              invoiceData={invoiceData}
              subtotal={calculateSubtotal()}
              tax={calculateTax()}
              total={calculateTotal()}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={generatePDF} className="w-full max-w-xs">
              Last ned PDF
            </Button>
            <Button onClick={handleSave} className="w-full max-w-xs">
              {invoiceId ? "Oppdater faktura" : "Lagre faktura"}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
