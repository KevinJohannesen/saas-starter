"use client";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogoUpload } from "./logo-upload";
import type { InvoiceData, InvoiceItem } from "../types/invoice";

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
}

export function InvoiceForm({ invoiceData, setInvoiceData }: InvoiceFormProps) {
  const updateField = (
    field: keyof Omit<InvoiceData, "items">,
    value: string | number | undefined
  ) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
    };
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem],
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeItem = (id: string) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Fakturadetaljer</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Fakturanummer</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Referanse</Label>
              <Input
                id="reference"
                value={invoiceData.reference}
                onChange={(e) => updateField("reference", e.target.value)}
                placeholder="Prosjekt, bestillingsnummer, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">MVA-sats (%)</Label>
              <select
                id="taxRate"
                value={invoiceData.taxRate}
                onChange={(e) =>
                  updateField("taxRate", Number.parseFloat(e.target.value))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="0">0% (Ingen MVA)</option>
                <option value="12">12% (Lav sats)</option>
                <option value="15">15%</option>
                <option value="25">25% (Standard)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Dato</Label>
              <Input
                id="date"
                type="date"
                value={invoiceData.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Forfallsdato</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Din Informasjon</h2>
          <LogoUpload
            logo={invoiceData.logo}
            onLogoChange={(logo) => updateField("logo", logo)}
          />
          <div className="space-y-2">
            <Label htmlFor="fromName">Navn/Firma</Label>
            <Input
              id="fromName"
              value={invoiceData.fromName}
              onChange={(e) => updateField("fromName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromEmail">E-post</Label>
            <Input
              id="fromEmail"
              type="email"
              value={invoiceData.fromEmail}
              onChange={(e) => updateField("fromEmail", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromAddress">Adresse</Label>
            <Textarea
              id="fromAddress"
              value={invoiceData.fromAddress}
              onChange={(e) => updateField("fromAddress", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Kundeinformasjon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="toName">Navn/Firma</Label>
            <Input
              id="toName"
              value={invoiceData.toName}
              onChange={(e) => updateField("toName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toEmail">E-post</Label>
            <Input
              id="toEmail"
              type="email"
              value={invoiceData.toEmail}
              onChange={(e) => updateField("toEmail", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="toAddress">Adresse</Label>
          <Textarea
            id="toAddress"
            value={invoiceData.toAddress}
            onChange={(e) => updateField("toAddress", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Varer</h2>
          <Button
            type="button"
            onClick={addItem}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Legg til vare
          </Button>
        </div>

        <div className="space-y-4">
          {invoiceData.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 items-end border-b pb-4"
            >
              <div className="col-span-5 space-y-2">
                <Label htmlFor={`item-${item.id}-desc`}>Beskrivelse</Label>
                <Input
                  id={`item-${item.id}-desc`}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor={`item-${item.id}-qty`}>Antall</Label>
                <Input
                  id={`item-${item.id}-qty`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "quantity",
                      Number.parseInt(e.target.value)
                    )
                  }
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label htmlFor={`item-${item.id}-price`}>Pris</Label>
                <Input
                  id={`item-${item.id}-price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "price",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  disabled={invoiceData.items.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notater</Label>
        <Textarea
          id="notes"
          value={invoiceData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          rows={3}
          placeholder="Betalingsbetingelser, takkemelding, etc."
        />
      </div>
    </div>
  );
}
