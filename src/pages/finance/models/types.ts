
// Define all type interfaces for the finance module

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  birthday: string;
  modality: string;
  class: string;
  status: "active" | "inactive";
  address: string;
  cityState: string;
  zipCode: string;
  parentName: string;
  parentPhone: string;
  parentCPF: string;
  enrollmentDate: string;
  notes: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  value?: number; // The amount to be paid
  amount?: number; // Legacy field, use value instead
  date?: string; // Date when payment was made (for paid status)
  description: string;
  method?: string;
  category: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  dueDate: string;
  notes?: string;
}

export interface Bill {
  id: string;
  description: string;
  supplier: string;
  category: string;
  value: number;
  dueDate: string;
  installments: number;
  status?: "paid" | "pending" | "overdue" | "cancelled";
  paymentDate?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  paymentMethod?: string;
  notes?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  modality: string;
  class: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "cancelled";
  enrollmentFee: number;
  monthlyFee: number;
  paymentDay: number;
  notes?: string;
}
