
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Interfaces para tipagem
export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  value: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paymentDate?: string;
  installments?: number;
  currentInstallment?: number;
  installmentValue?: number;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  relatedTo?: string;
  notes?: string;
}

// Categories para transações
export const EXPENSE_CATEGORIES = [
  "Salários",
  "Aluguel",
  "Água/Luz/Internet",
  "Materiais",
  "Manutenção",
  "Marketing",
  "Impostos",
  "Outras Despesas"
];

export const INCOME_CATEGORIES = [
  "Mensalidades",
  "Matrículas",
  "Eventos",
  "Produtos",
  "Patrocínios",
  "Outras Receitas"
];

export const PAYMENT_METHODS = [
  "Dinheiro",
  "PIX",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Transferência Bancária",
  "Boleto"
];

// Mock students para demonstração
export const STUDENTS = [
  { id: "1", name: "Ana Silva", modality: "Ballet" },
  { id: "2", name: "Lucas Oliveira", modality: "Futsal" },
  { id: "3", name: "Maria Santos", modality: "Jazz" },
  { id: "4", name: "Pedro Costa", modality: "Ginástica" },
  { id: "5", name: "Juliana Lima", modality: "Ballet" },
];

export function useFinanceData() {
  // Estado para armazenar mensalidades
  const [payments, setPayments] = useState<Payment[]>(() => {
    const savedPayments = localStorage.getItem("danceSchool_payments");
    return savedPayments ? JSON.parse(savedPayments) : [];
  });

  // Estado para armazenar transações (entradas e saídas)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("danceSchool_transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Persistir mudanças no localStorage
  useEffect(() => {
    localStorage.setItem("danceSchool_payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("danceSchool_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Funções para manipular mensalidades
  const addPayment = (payment: Omit<Payment, "id">) => {
    const student = STUDENTS.find(s => s.id === payment.studentId);
    if (!student) {
      toast.error("Aluno não encontrado!");
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      studentName: student.name,
      ...payment,
    };
    
    // Se for parcelado, cria as parcelas
    if (payment.installments && payment.installments > 1) {
      const installmentValue = payment.value / payment.installments;
      const baseDate = new Date(payment.dueDate);
      
      const installments: Payment[] = Array.from({ length: payment.installments }).map((_, index) => {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(baseDate.getMonth() + index);
        
        return {
          id: `${newPayment.id}-${index + 1}`,
          studentId: payment.studentId,
          studentName: student.name,
          description: `${payment.description} (${index + 1}/${payment.installments})`,
          value: installmentValue,
          dueDate: dueDate.toISOString().split('T')[0],
          status: "pending",
          installments: payment.installments,
          currentInstallment: index + 1,
          installmentValue: installmentValue,
        };
      });
      
      setPayments(prev => [...prev, ...installments]);
      return;
    }
    
    setPayments(prev => [...prev, newPayment]);
  };

  const updatePayment = (id: string, payment: Partial<Payment>) => {
    setPayments(prev => 
      prev.map(p => 
        p.id === id
          ? { ...p, ...payment }
          : p
      )
    );
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    toast.success("Mensalidade removida com sucesso!");
  };

  const markAsPaid = (id: string) => {
    setPayments(prev => 
      prev.map(p => 
        p.id === id
          ? { 
              ...p, 
              status: "paid", 
              paymentDate: new Date().toISOString().split('T')[0] 
            }
          : p
      )
    );
    
    // Adicionar também como uma transação de entrada
    const payment = payments.find(p => p.id === id);
    if (payment) {
      addTransaction({
        type: "income",
        description: `Mensalidade: ${payment.description}`,
        category: "Mensalidades",
        amount: payment.value,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: "Dinheiro",
        relatedTo: payment.studentName,
      });
    }
    
    toast.success("Pagamento registrado com sucesso!");
  };

  // Funções para manipular transações
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transaction,
    };
    
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id
          ? { ...t, ...transaction }
          : t
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success("Transação removida com sucesso!");
  };

  return {
    payments,
    transactions,
    addPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
