
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Bill } from "../models/types";
import { BILLS } from "../models/mockData";

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>(BILLS);

  // Verificar contas vencidas diariamente
  useEffect(() => {
    updateBillStatuses();
  }, []);

  const updateBillStatuses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setBills(current => current.map(bill => {
      if (bill.status === 'pending') {
        const dueDate = new Date(bill.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return { ...bill, status: 'overdue' };
        }
      }
      return bill;
    }));
  };

  const addBill = (bill: Omit<Bill, "id" | "status">) => {
    const newBill = {
      ...bill,
      id: uuidv4(),
      status: 'pending' as const
    };
    setBills([...bills, newBill]);
    return newBill;
  };

  const updateBill = (id: string, updatedBill: Partial<Bill>) => {
    setBills(bills.map((bill) => 
      bill.id === id ? { ...bill, ...updatedBill } : bill
    ));
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const markBillAsPaid = (id: string, paymentMethod?: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    setBills(bills.map((bill) => 
      bill.id === id ? {
        ...bill,
        status: 'paid',
        paymentDate: today
      } : bill
    ));
  };

  const getBillsByStatus = (status: "paid" | "pending" | "overdue" | "all") => {
    if (status === "all") return bills;
    return bills.filter(bill => bill.status === status);
  };

  return {
    bills,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    updateBillStatuses,
    getBillsByStatus
  };
};
