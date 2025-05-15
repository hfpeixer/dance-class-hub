
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

// Define data types
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
}

export const PAYMENT_METHODS = [
  "Dinheiro",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Boleto Bancário",
  "PIX",
  "Transferência Bancária"
];

// Mock data
const initialStudents: Student[] = [
  {
    id: uuidv4(),
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "1199999999",
    age: 10,
    birthday: "2013-05-20",
    modality: "Futsal",
    class: "Futsal Infantil - Terça e Quinta",
    status: "active",
    address: "Rua das Flores, 123",
    cityState: "São Paulo, SP",
    zipCode: "01000-000",
    parentName: "Pedro Silva",
    parentPhone: "1198888888",
    parentCPF: "123.456.789-00",
    enrollmentDate: "2023-01-15",
    notes: "Aluno dedicado e com bom desempenho."
  },
  {
    id: uuidv4(),
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    phone: "2199999999",
    age: 12,
    birthday: "2011-10-10",
    modality: "Ballet",
    class: "Ballet Juvenil - Segunda e Sexta",
    status: "active",
    address: "Avenida Paulista, 456",
    cityState: "Rio de Janeiro, RJ",
    zipCode: "20000-000",
    parentName: "Ana Oliveira",
    parentPhone: "2197777777",
    parentCPF: "987.654.321-00",
    enrollmentDate: "2023-02-20",
    notes: "Precisa de mais atenção nas aulas práticas."
  },
  {
    id: uuidv4(),
    name: "Lucas Santos",
    email: "lucas.santos@example.com",
    phone: "3199999999",
    age: 9,
    birthday: "2014-03-25",
    modality: "Ginástica",
    class: "Ginástica Artística - Terça e Quinta",
    status: "inactive",
    address: "Rua da Bahia, 789",
    cityState: "Belo Horizonte, MG",
    zipCode: "30000-000",
    parentName: "Marcos Santos",
    parentPhone: "3196666666",
    parentCPF: "456.789.123-00",
    enrollmentDate: "2023-03-10",
    notes: "Afastado por motivo de saúde."
  },
  {
    id: uuidv4(),
    name: "Sofia Almeida",
    email: "sofia.almeida@example.com",
    phone: "4199999999",
    age: 11,
    birthday: "2012-07-01",
    modality: "Jazz",
    class: "Jazz Teen - Terça e Quinta",
    status: "active",
    address: "Rua XV de Novembro, 1011",
    cityState: "Curitiba, PR",
    zipCode: "80000-000",
    parentName: "Carla Almeida",
    parentPhone: "4195555555",
    parentCPF: "789.123.456-00",
    enrollmentDate: "2023-04-05",
    notes: "Destaque nas apresentações de Jazz."
  },
  {
    id: uuidv4(),
    name: "Enzo Costa",
    email: "enzo.costa@example.com",
    phone: "5199999999",
    age: 8,
    birthday: "2015-12-15",
    modality: "Hip Hop",
    class: "Hip Hop Teen - Sexta e Sábado",
    status: "active",
    address: "Avenida Farrapos, 1213",
    cityState: "Porto Alegre, RS",
    zipCode: "90000-000",
    parentName: "Ricardo Costa",
    parentPhone: "5194444444",
    parentCPF: "234.567.890-00",
    enrollmentDate: "2023-05-01",
    notes: "Participa ativamente das aulas de Hip Hop."
  }
];

const initialPayments: Payment[] = [
  {
    id: uuidv4(),
    studentId: initialStudents[0].id,
    studentName: initialStudents[0].name,
    amount: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "Cartão de Crédito",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-10-05",
		notes: "Pagamento efetuado no prazo."
  },
  {
    id: uuidv4(),
    studentId: initialStudents[1].id,
    studentName: initialStudents[1].name,
    amount: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "Boleto Bancário",
    category: "Mensalidade",
    status: "pending",
    dueDate: "2023-10-05",
		notes: "Aguardando compensação do boleto."
  },
  {
    id: uuidv4(),
    studentId: initialStudents[2].id,
    studentName: initialStudents[2].name,
    amount: 150.00,
    date: "2023-09-01",
    description: "Mensalidade de Setembro",
    method: "Dinheiro",
    category: "Mensalidade",
    status: "overdue",
    dueDate: "2023-09-05",
		notes: "Pagamento em atraso. Aluno afastado."
  },
  {
    id: uuidv4(),
    studentId: initialStudents[3].id,
    studentName: initialStudents[3].name,
    amount: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "Transferência Bancária",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-10-05",
		notes: "Transferência realizada com sucesso."
  },
  {
    id: uuidv4(),
    studentId: initialStudents[4].id,
    studentName: initialStudents[4].name,
    amount: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "PIX",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-10-05",
		notes: "Pagamento via PIX confirmado."
  }
];

export const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Água",
  "Luz",
  "Telefone",
  "Internet",
  "Material de Limpeza",
  "Material de Escritório",
  "Salários",
  "Impostos",
  "Marketing",
  "Outros"
];

const initialSuppliers: Supplier[] = [
  { id: uuidv4(), name: "Sanepar" },
  { id: uuidv4(), name: "Copel" },
  { id: uuidv4(), name: "Vivo" },
  { id: uuidv4(), name: "Claro" },
  { id: uuidv4(), name: "Mercado Livre" },
];

const initialBills: Bill[] = [
  {
    id: uuidv4(),
    description: "Conta de água",
    supplier: "Sanepar",
    category: "Água",
    value: 150.00,
    dueDate: "2023-10-15",
    installments: 1,
    status: "pending",
    notes: "Referente ao mês de setembro."
  },
  {
    id: uuidv4(),
    description: "Conta de luz",
    supplier: "Copel",
    category: "Luz",
    value: 300.00,
    dueDate: "2023-10-20",
    installments: 1,
    status: "pending",
    notes: "Referente ao mês de setembro."
  },
  {
    id: uuidv4(),
    description: "Conta de telefone",
    supplier: "Vivo",
    category: "Telefone",
    value: 100.00,
    dueDate: "2023-10-25",
    installments: 1,
    status: "pending",
    notes: "Referente ao plano de telefonia."
  },
  {
    id: uuidv4(),
    description: "Compra de materiais de limpeza",
    supplier: "Mercado Livre",
    category: "Material de Limpeza",
    value: 200.00,
    dueDate: "2023-10-30",
    installments: 2,
    status: "pending",
    notes: "Compra realizada para o estoque."
  }
];

const initialTransactions: Transaction[] = [
  {
    id: uuidv4(),
    date: "2023-10-05",
    amount: 500.00,
    description: "Venda de uniformes",
    category: "Vendas",
    method: "Dinheiro",
    type: "income",
    notes: "Venda de 5 uniformes"
  },
  {
    id: uuidv4(),
    date: "2023-10-03",
    amount: 300.00,
    description: "Compra de material de limpeza",
    category: "Material de Limpeza",
    method: "Cartão de Crédito",
    type: "expense",
    notes: "Material para o mês de outubro"
  }
];

const initialEnrollments: Enrollment[] = [
  {
    id: uuidv4(),
    studentId: initialStudents[0].id,
    studentName: initialStudents[0].name,
    modality: "Futsal",
    className: "Futsal Infantil - Terça e Quinta",
    startDate: "2023-01-15",
    status: "active",
    value: 150.00,
    notes: "Matrícula regular"
  },
  {
    id: uuidv4(),
    studentId: initialStudents[1].id,
    studentName: initialStudents[1].name,
    modality: "Ballet",
    className: "Ballet Juvenil - Segunda e Sexta",
    startDate: "2023-02-20",
    status: "active",
    value: 150.00,
    notes: "Matrícula regular"
  }
];

export const SUPPLIERS = initialSuppliers;

// Custom hook for managing finance data
export const useFinanceData = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading data from an API
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // --- Student Management ---
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: uuidv4() };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, updatedStudent: Omit<Student, 'id'>) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, ...updatedStudent, id } : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
    setPayments(payments.filter((payment) => payment.studentId !== id));
  };

  const toggleStudentStatus = (id: string) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, status: student.status === "active" ? "inactive" : "active" } : student
      )
    );
  };

  // --- Payment Management ---
  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: uuidv4() };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id: string, updatedPayment: Partial<Omit<Payment, 'id'>>) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, ...updatedPayment, id } : payment
      )
    );
  };

  const deletePayment = (id: string) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const markAsPaid = (id: string, paymentMethod: string) => {
    updatePayment(id, {
      status: "paid",
      date: new Date().toISOString().split('T')[0],
      method: paymentMethod
    });
  };

  // --- Transaction Management ---
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedTransaction, id } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  // --- Bill Management ---
  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill = { ...bill, id: uuidv4() };
    setBills([...bills, newBill]);
  };

  const updateBill = (id: string, updatedBill: Partial<Omit<Bill, 'id'>>) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, ...updatedBill, id } : bill
      )
    );
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const markBillAsPaid = (id: string, paymentMethod: string) => {
    updateBill(id, {
      status: "paid",
      paymentDate: new Date().toISOString().split('T')[0]
    });
  };

  // --- Enrollment Management ---
  const addEnrollment = (enrollment: Omit<Enrollment, 'id'>) => {
    const newEnrollment = { ...enrollment, id: uuidv4() };
    setEnrollments([...enrollments, newEnrollment]);
  };

  const updateEnrollment = (id: string, updatedEnrollment: Omit<Enrollment, 'id'>) => {
    setEnrollments(
      enrollments.map((enrollment) =>
        enrollment.id === id ? { ...enrollment, ...updatedEnrollment, id } : enrollment
      )
    );
  };

  const deleteEnrollment = (id: string) => {
    setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id));
  };

  const cancelEnrollment = (id: string) => {
    setEnrollments(
      enrollments.map((enrollment) =>
        enrollment.id === id ? { ...enrollment, status: "inactive", endDate: new Date().toISOString().split('T')[0] } : enrollment
      )
    );
  };

  return {
    students,
    payments,
    bills,
    transactions,
    enrollments,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    addPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    cancelEnrollment
  };
};
