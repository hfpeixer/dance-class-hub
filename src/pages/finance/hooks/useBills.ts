
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Bill } from '../models/types';
import { BILLS } from '../models/mockData';

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>(BILLS);

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

  const markBillAsPaid = (id: string, paymentDate: string = new Date().toISOString().split('T')[0]) => {
    updateBill(id, {
      status: "paid",
      paymentDate
    });
  };

  const updateBillStatuses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check for overdue bills
    const updatedBills = bills.map(bill => {
      if (bill.status === 'pending') {
        const dueDate = new Date(bill.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return {
            ...bill,
            status: 'overdue'
          };
        }
      }
      return bill;
    });
    
    const hasChanges = JSON.stringify(updatedBills) !== JSON.stringify(bills);
    
    if (hasChanges) {
      bills.forEach((bill, index) => {
        if (bill.status !== updatedBills[index].status) {
          updateBill(bill.id, { status: 'overdue' });
        }
      });
    }
  };

  return {
    bills,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    updateBillStatuses
  };
};
