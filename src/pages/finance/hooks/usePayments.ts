
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Payment } from "../models/types";
import { PAYMENTS } from "../models/mockData";

/**
 * Payments data hook
 * In production, this would fetch and manage payments data from a database
 */
export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Verify overdue payments daily
  useEffect(() => {
    updatePaymentStatuses();
  }, []);

  // This would become an API call in production
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
    // In production, this would be an API call to create a payment
    const newPayment = {
      ...payment,
      id: uuidv4()
    };
    setPayments([...payments, newPayment]);
    return newPayment;
  };

  const updatePayment = (id: string, updatedPayment: Partial<Payment>) => {
    // In production, this would be an API call to update a payment
    setPayments(payments.map((payment) => 
      payment.id === id ? { ...payment, ...updatedPayment } : payment
    ));
  };

  const deletePayment = (id: string) => {
    // In production, this would be an API call to delete a payment
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const markAsPaid = (id: string, method: string) => {
    // In production, this would be an API call to mark a payment as paid
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
    // In production, this could be optimized with a database query
    return payments.filter(payment => payment.studentId === studentId);
  };

  const getPaymentsByStatus = (status: "paid" | "pending" | "overdue" | "all") => {
    // In production, this could be optimized with a database query
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
    getPaymentsByStatus,
    isLoading,
    error
  };
};
