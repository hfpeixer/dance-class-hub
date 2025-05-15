
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Payment } from "../models/types";
import { PAYMENTS } from "../models/mockData";

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);

  // Verificar pagamentos vencidos diariamente
  useEffect(() => {
    updatePaymentStatuses();
  }, []);

  const updatePaymentStatuses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setPayments(current => current.map(payment => {
      if (payment.status === 'pending') {
        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return { ...payment, status: 'overdue' };
        }
      }
      return payment;
    }));
  };

  const addPayment = (payment: Omit<Payment, "id">) => {
    const newPayment = {
      ...payment,
      id: uuidv4()
    };
    setPayments([...payments, newPayment]);
    return newPayment;
  };

  const updatePayment = (id: string, updatedPayment: Partial<Payment>) => {
    setPayments(payments.map((payment) => 
      payment.id === id ? { ...payment, ...updatedPayment } : payment
    ));
  };

  const deletePayment = (id: string) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const markAsPaid = (id: string, method: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    setPayments(payments.map((payment) => 
      payment.id === id ? {
        ...payment,
        status: 'paid',
        date: today,
        method
      } : payment
    ));
  };

  const getPaymentsByStudent = (studentId: string) => {
    return payments.filter(payment => payment.studentId === studentId);
  };

  const getPaymentsByStatus = (status: "paid" | "pending" | "overdue" | "all") => {
    if (status === "all") return payments;
    return payments.filter(payment => payment.status === status);
  };

  return {
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    updatePaymentStatuses,
    getPaymentsByStudent,
    getPaymentsByStatus
  };
};
