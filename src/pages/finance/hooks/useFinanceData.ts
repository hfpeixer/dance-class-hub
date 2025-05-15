
import { useState, useEffect } from "react";
import { useStudents } from "./useStudents";
import { usePayments } from "./usePayments";
import { useBills } from "./useBills";
import { useTransactions } from "./useTransactions";
import { useEnrollments } from "./useEnrollments";

// Re-export from models for backward compatibility
export * from "../models/types";
export * from "../models/constants";
export { STUDENTS, SUPPLIERS, MODALITIES, CLASSES, PAYMENTS, BILLS, TRANSACTIONS, ENROLLMENTS } from "../models/mockData";

// Main hook that combines all finance data hooks
export const useFinanceData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const studentsHook = useStudents();
  const paymentsHook = usePayments();
  const billsHook = useBills();
  const transactionsHook = useTransactions();
  const enrollmentsHook = useEnrollments();

  // Check for overdue payments and bills on component mount and when data changes
  useEffect(() => {
    // Simulate loading data from an API
    setIsLoading(true);
    
    paymentsHook.updatePaymentStatuses();
    billsHook.updateBillStatuses();
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Combine all hooks into a single object
  return {
    ...studentsHook,
    ...paymentsHook,
    ...billsHook,
    ...transactionsHook,
    ...enrollmentsHook,
    isLoading
  };
};
