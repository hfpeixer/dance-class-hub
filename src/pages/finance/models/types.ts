
// Define all finance related data types
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
  address?: string;
  cityState?: string;
  zipCode?: string;
  parentName?: string;
  parentPhone?: string;
  parentCPF?: string;
  enrollmentDate: string;
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  description: string;
  method: string;
  category: string;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  notes?: string;
  value?: number; // Added for compatibility with existing code
  installments?: number;
  currentInstallment?: number;
  paymentDate?: string;
}

export interface Bill {
  id: string;
  description: string;
  supplier: string;
  category: string;
  value: number;
  dueDate: string;
  installments: number;
  documentNumber?: string;
  status?: "paid" | "pending" | "overdue";
  paymentDate?: string;
  currentInstallment?: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  method: string;
  type: "income" | "expense";
  notes?: string;
  relatedTo?: string;
  paymentMethod?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  modality: string;
  className: string;
  startDate: string;
  endDate?: string;
  status: "active" | "inactive" | "completed";
  value: number;
  notes?: string;
  date?: string;
  installments?: number;
  modalityName?: string;
}

// Class and Modality interfaces for enrollment management
export interface Modality {
  id: string;
  name: string;
  monthlyFee: number;
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  modalityId: string;
  schedule: string;
  instructor: string;
  maxStudents?: number;
}
