
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from '../models/types';
import { PAYMENTS } from '../models/mockData';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);

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

  const updatePaymentStatuses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check for overdue payments
    const updatedPayments = payments.map(payment => {
      if (payment.status === 'pending') {
        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return {
            ...payment,
            status: 'overdue'
          };
        }
      }
      return payment;
    });
    
    const hasChanges = JSON.stringify(updatedPayments) !== JSON.stringify(payments);
    
    if (hasChanges) {
      payments.forEach((payment, index) => {
        if (payment.status !== updatedPayments[index].status) {
          updatePayment(payment.id, { status: 'overdue' });
        }
      });
    }
  };

  return {
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    updatePaymentStatuses
  };
};
