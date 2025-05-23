
import { useState, useEffect } from "react";
import { useStudents } from "./useStudents";
import { usePayments } from "./usePayments";
import { useBills } from "./useBills";
import { useTransactions } from "./useTransactions";
import { useEnrollments } from "./useEnrollments";

// Re-export from models for backward compatibility
export * from "../models/types";
export * from "../models/constants";
export { STUDENTS, SUPPLIERS, PAYMENTS, BILLS, TRANSACTIONS, ENROLLMENTS, MODALITIES, CLASSES } from "../models/mockData";

/**
 * Main finance data hook combining all finance-related hooks
 * Uses real Supabase database connections
 */
export const useFinanceData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const studentsHook = useStudents();
  const paymentsHook = usePayments();
  const billsHook = useBills();
  const transactionsHook = useTransactions();
  const enrollmentsHook = useEnrollments();

  // Determine overall loading state and errors
  useEffect(() => {
    const loading = 
      studentsHook.isLoading || 
      paymentsHook.isLoading || 
      billsHook.isLoading || 
      transactionsHook.isLoading || 
      enrollmentsHook.isLoading;
    
    setIsLoading(loading);
    
    const firstError = 
      studentsHook.error || 
      paymentsHook.error || 
      billsHook.error || 
      transactionsHook.error || 
      enrollmentsHook.error;
    
    setError(firstError);
  }, [
    studentsHook.isLoading, paymentsHook.isLoading, billsHook.isLoading, transactionsHook.isLoading, enrollmentsHook.isLoading,
    studentsHook.error, paymentsHook.error, billsHook.error, transactionsHook.error, enrollmentsHook.error
  ]);

  // Combine all hooks into a single object
  return {
    ...studentsHook,
    ...paymentsHook,
    ...billsHook,
    ...transactionsHook,
    ...enrollmentsHook,
    isLoading,
    error
  };
};
