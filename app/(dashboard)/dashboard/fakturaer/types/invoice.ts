export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  reference: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
  status: "draft" | "sent" | "paid";
  createdAt: string;
  updatedAt: string;
  logo?: string; // Base64 encoded logo image
  createdBy?: string; // User ID of the creator
  assignedTo?: string; // User ID of the assigned user
}

export type InvoiceStatus = "draft" | "sent" | "paid";
