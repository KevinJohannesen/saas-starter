"use client";

import type { InvoiceData } from "../types/invoice";

// Helper function for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
  }).format(amount);
};

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  subtotal: number;
  tax: number;
  total: number;
}

export function InvoicePreview({
  invoiceData,
  subtotal,
  tax,
  total,
}: InvoicePreviewProps) {
  return (
    <div
      id="invoice-preview"
      className="p-8 bg-white shadow-lg min-h-[29.7cm] w-full max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          {invoiceData.logo && (
            <div className="mb-4">
              <img
                src={invoiceData.logo}
                alt="Bedriftslogo"
                className="max-h-24 max-w-[200px] object-contain"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-800">FAKTURA</h1>
          <p className="text-gray-500 mt-1">#{invoiceData.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-gray-800">
            {invoiceData.fromName}
          </p>
          <p className="text-gray-600">{invoiceData.fromEmail}</p>
          <p className="text-gray-600 whitespace-pre-line">
            {invoiceData.fromAddress}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-gray-600 font-semibold mb-2">Faktureres til:</h2>
          <p className="font-bold text-gray-800">{invoiceData.toName}</p>
          <p className="text-gray-600">{invoiceData.toEmail}</p>
          <p className="text-gray-600 whitespace-pre-line">
            {invoiceData.toAddress}
          </p>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-gray-600 font-semibold mb-2">Fakturadato:</h2>
              <p className="text-gray-800">
                {new Date(invoiceData.date).toLocaleDateString("nb-NO")}
              </p>
            </div>
            <div>
              <h2 className="text-gray-600 font-semibold mb-2">
                Forfallsdato:
              </h2>
              <p className="text-gray-800">
                {new Date(invoiceData.dueDate).toLocaleDateString("nb-NO")}
              </p>
            </div>
            {invoiceData.reference && (
              <div className="col-span-2">
                <h2 className="text-gray-600 font-semibold mb-2">Referanse:</h2>
                <p className="text-gray-800">{invoiceData.reference}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-3 text-left text-gray-600">Beskrivelse</th>
            <th className="py-3 text-right text-gray-600">Antall</th>
            <th className="py-3 text-right text-gray-600">Pris</th>
            <th className="py-3 text-right text-gray-600">Beløp</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-4 text-gray-800">{item.description}</td>
              <td className="py-4 text-right text-gray-800">{item.quantity}</td>
              <td className="py-4 text-right text-gray-800">
                {formatCurrency(item.price)}
              </td>
              <td className="py-4 text-right text-gray-800">
                {formatCurrency(item.quantity * item.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-800">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">MVA ({invoiceData.taxRate}%):</span>
            <span className="text-gray-800">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-2">
            <span>Totalbeløp:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="border-t border-gray-300 pt-6">
          <h2 className="text-gray-600 font-semibold mb-2">Notater:</h2>
          <p className="text-gray-800 whitespace-pre-line">
            {invoiceData.notes}
          </p>
        </div>
      )}
    </div>
  );
}
