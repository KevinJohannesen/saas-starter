"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { InvoiceData, InvoiceStatus } from "../types/invoice";

type InvoiceContextType = {
  invoices: InvoiceData[];
  addInvoice: (invoice: InvoiceData) => void;
  updateInvoice: (invoice: InvoiceData) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  getInvoiceById: (id: string) => InvoiceData | undefined;
  assignInvoice: (id: string, userId: string) => void;
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  // Load invoices from localStorage on initial render
  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice: InvoiceData) => {
    // Add basic metadata without user dependencies
    const invoiceWithMetadata = {
      ...invoice,
      createdBy: "current-user", // Default value since we removed auth
      assignedTo: "current-user",
    };
    setInvoices((prev) => [...prev, invoiceWithMetadata]);
  };

  const updateInvoice = (invoice: InvoiceData) => {
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === invoice.id
          ? { ...invoice, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? { ...invoice, status, updatedAt: new Date().toISOString() }
          : invoice
      )
    );
  };

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  const assignInvoice = (id: string, userId: string) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              assignedTo: userId,
              updatedAt: new Date().toISOString(),
            }
          : invoice
      )
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        getInvoiceById,
        assignInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }
  return context;
}
