
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

export interface Bill {
  id: string;
  description: string;
  supplier: string;
  category: string;
  value: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paymentDate?: string;
  installments?: number;
  currentInstallment?: number;
  installmentValue?: number;
  documentNumber?: string;
  notes?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  modalityId: string;
  modalityName: string;
  classId: string;
  className: string;
  date: string;
  value: number;
  paymentMethod: string;
  status: "active" | "inactive" | "cancelled";
  installments?: number;
  paymentIds?: string[];
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

// Mock suppliers para demonstração
export const SUPPLIERS = [
  { id: "1", name: "Fornecedor de Materiais Esportivos" },
  { id: "2", name: "Empresa de Limpeza" },
  { id: "3", name: "Distribuidora de Água" },
  { id: "4", name: "Serviço de Internet" },
  { id: "5", name: "Gráfica" },
];

// Mock modalities e classes para matrículas
export const MODALITIES = [
  { id: "1", name: "Ballet", monthlyFee: 150 },
  { id: "2", name: "Jazz", monthlyFee: 140 },
  { id: "3", name: "Ginástica", monthlyFee: 160 },
  { id: "4", name: "Futsal", monthlyFee: 130 },
  { id: "5", name: "Hip Hop", monthlyFee: 145 },
];

export const CLASSES = [
  { id: "1", name: "Ballet Infantil - Segunda e Quarta", modalityId: "1" },
  { id: "2", name: "Ballet Infantil - Terça e Quinta", modalityId: "1" },
  { id: "3", name: "Ballet Juvenil - Segunda e Sexta", modalityId: "1" },
  { id: "4", name: "Ballet Adulto - Sábados", modalityId: "1" },
  { id: "5", name: "Jazz Kids - Quarta e Sexta", modalityId: "2" },
  { id: "6", name: "Jazz Teen - Terça e Quinta", modalityId: "2" },
  { id: "7", name: "Jazz Adulto - Sábados", modalityId: "2" },
  { id: "8", name: "Ginástica Artística - Terça e Quinta", modalityId: "3" },
  { id: "9", name: "Ginástica Rítmica - Segunda e Quarta", modalityId: "3" },
  { id: "10", name: "Futsal Juvenil - Segunda e Quarta", modalityId: "4" },
  { id: "11", name: "Futsal Infantil - Terça e Quinta", modalityId: "4" },
  { id: "12", name: "Hip Hop Teen - Sexta e Sábado", modalityId: "5" },
  { id: "13", name: "Hip Hop Adulto - Terça e Quinta", modalityId: "5" },
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

  // Estado para armazenar contas a pagar
  const [bills, setBills] = useState<Bill[]>(() => {
    const savedBills = localStorage.getItem("danceSchool_bills");
    return savedBills ? JSON.parse(savedBills) : [];
  });

  // Estado para armazenar matrículas
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const savedEnrollments = localStorage.getItem("danceSchool_enrollments");
    return savedEnrollments ? JSON.parse(savedEnrollments) : [];
  });

  // Persistir mudanças no localStorage
  useEffect(() => {
    localStorage.setItem("danceSchool_payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("danceSchool_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("danceSchool_bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("danceSchool_enrollments", JSON.stringify(enrollments));
  }, [enrollments]);

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

  // Funções para manipular contas a pagar
  const addBill = (bill: Omit<Bill, "id">) => {
    const newBill: Bill = {
      id: Date.now().toString(),
      ...bill,
    };
    
    // Se for parcelado, cria as parcelas
    if (bill.installments && bill.installments > 1) {
      const installmentValue = bill.value / bill.installments;
      const baseDate = new Date(bill.dueDate);
      
      const installments: Bill[] = Array.from({ length: bill.installments }).map((_, index) => {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(baseDate.getMonth() + index);
        
        return {
          id: `${newBill.id}-${index + 1}`,
          description: `${bill.description} (${index + 1}/${bill.installments})`,
          supplier: bill.supplier,
          category: bill.category,
          value: installmentValue,
          dueDate: dueDate.toISOString().split('T')[0],
          status: "pending",
          installments: bill.installments,
          currentInstallment: index + 1,
          installmentValue: installmentValue,
          documentNumber: bill.documentNumber,
          notes: bill.notes,
        };
      });
      
      setBills(prev => [...prev, ...installments]);
      return;
    }
    
    setBills(prev => [...prev, newBill]);
  };

  const updateBill = (id: string, bill: Partial<Bill>) => {
    setBills(prev => 
      prev.map(b => 
        b.id === id
          ? { ...b, ...bill }
          : b
      )
    );
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
    toast.success("Conta removida com sucesso!");
  };

  const markBillAsPaid = (id: string, paymentMethod: string) => {
    setBills(prev => 
      prev.map(b => 
        b.id === id
          ? { 
              ...b, 
              status: "paid", 
              paymentDate: new Date().toISOString().split('T')[0] 
            }
          : b
      )
    );
    
    // Adicionar também como uma transação de saída
    const bill = bills.find(b => b.id === id);
    if (bill) {
      addTransaction({
        type: "expense",
        description: `Pagamento: ${bill.description}`,
        category: bill.category,
        amount: bill.value,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod,
        relatedTo: bill.supplier,
      });
    }
    
    toast.success("Pagamento registrado com sucesso!");
  };

  // Funções para manipular matrículas
  const addEnrollment = (enrollment: Omit<Enrollment, "id">) => {
    const student = STUDENTS.find(s => s.id === enrollment.studentId);
    const modality = MODALITIES.find(m => m.id === enrollment.modalityId);
    const classData = CLASSES.find(c => c.id === enrollment.classId);
    
    if (!student || !modality || !classData) {
      toast.error("Dados inválidos para matrícula!");
      return;
    }

    // Gerar ID para a matrícula
    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      studentName: student.name,
      modalityName: modality.name,
      className: classData.name,
      ...enrollment,
      status: "active",
      paymentIds: [],
    };

    // Criação das parcelas de mensalidade
    const installments = enrollment.installments || 1;
    const enrollmentFee = enrollment.value;
    const monthlyFee = modality.monthlyFee;
    
    // Primeira parcela (matrícula + primeira mensalidade)
    const firstPaymentValue = (enrollmentFee + monthlyFee);
    const firstDueDate = new Date();
    
    const payments: Payment[] = [];
    
    // Criar pagamento para a matrícula + primeira mensalidade
    const firstPayment: Omit<Payment, "id"> = {
      studentId: enrollment.studentId,
      studentName: student.name,
      description: `Matrícula + 1ª Mensalidade - ${modality.name}`,
      value: firstPaymentValue,
      dueDate: firstDueDate.toISOString().split('T')[0],
      status: "pending",
    };
    
    const newFirstPayment = {
      id: Date.now().toString(),
      ...firstPayment,
    };
    
    payments.push(newFirstPayment);
    
    // Criar demais mensalidades
    if (installments > 1) {
      const nextMonthDate = new Date(firstDueDate);
      
      for (let i = 2; i <= installments; i++) {
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        
        const payment: Payment = {
          id: `${Date.now()}-${i}`,
          studentId: enrollment.studentId,
          studentName: student.name,
          description: `Mensalidade ${i}/${installments} - ${modality.name}`,
          value: monthlyFee,
          dueDate: nextMonthDate.toISOString().split('T')[0],
          status: "pending",
        };
        
        payments.push(payment);
      }
    }
    
    // Adicionar as mensalidades ao sistema
    setPayments(prev => [...prev, ...payments]);
    
    // Atualizar a matrícula com os IDs dos pagamentos gerados
    newEnrollment.paymentIds = payments.map(p => p.id);
    
    // Registrar a matrícula
    setEnrollments(prev => [...prev, newEnrollment]);
    
    // Registrar a transação se o pagamento foi à vista
    if (enrollment.paymentMethod) {
      addTransaction({
        type: "income",
        description: `Matrícula: ${student.name} - ${modality.name}`,
        category: "Matrículas",
        amount: firstPaymentValue,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: enrollment.paymentMethod,
        relatedTo: student.name,
      });
      
      // Marcar o primeiro pagamento como pago
      if (payments.length > 0) {
        payments[0].status = "paid";
        payments[0].paymentDate = new Date().toISOString().split('T')[0];
      }
    }
    
    toast.success("Matrícula realizada com sucesso!");
  };

  const updateEnrollment = (id: string, enrollment: Partial<Enrollment>) => {
    setEnrollments(prev => 
      prev.map(e => 
        e.id === id
          ? { ...e, ...enrollment }
          : e
      )
    );
  };

  const deleteEnrollment = (id: string) => {
    // Encontrar a matrícula
    const enrollmentToDelete = enrollments.find(e => e.id === id);
    
    // Se a matrícula tem pagamentos associados, removê-los também
    if (enrollmentToDelete?.paymentIds && enrollmentToDelete.paymentIds.length > 0) {
      // Filtrar pagamentos não pagos para remoção
      const paymentsToRemove = payments.filter(
        p => enrollmentToDelete.paymentIds?.includes(p.id) && p.status !== "paid"
      );
      
      if (paymentsToRemove.length > 0) {
        setPayments(prev => prev.filter(p => !enrollmentToDelete.paymentIds?.includes(p.id) || p.status === "paid"));
      }
    }
    
    // Remover a matrícula
    setEnrollments(prev => prev.filter(e => e.id !== id));
    toast.success("Matrícula removida com sucesso!");
  };

  // Cancelar matrícula
  const cancelEnrollment = (id: string) => {
    // Marcar status como cancelado
    setEnrollments(prev => 
      prev.map(e => 
        e.id === id
          ? { ...e, status: "cancelled" }
          : e
      )
    );
    
    // Encontrar a matrícula
    const enrollment = enrollments.find(e => e.id === id);
    
    // Se a matrícula tem pagamentos associados pendentes, cancelá-los também
    if (enrollment?.paymentIds && enrollment.paymentIds.length > 0) {
      setPayments(prev => 
        prev.map(p => 
          enrollment.paymentIds?.includes(p.id) && p.status === "pending"
            ? { ...p, status: "overdue", notes: (p.notes || '') + ' [Matrícula cancelada]' }
            : p
        )
      );
    }
    
    toast.success("Matrícula cancelada com sucesso!");
  };

  return {
    payments,
    transactions,
    bills,
    enrollments,
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
    cancelEnrollment,
  };
}
