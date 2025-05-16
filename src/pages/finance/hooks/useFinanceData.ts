
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
 * This hook is designed to eventually connect to a real database
 * and replace the mock data with actual database queries
 */
export const useFinanceData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const studentsHook = useStudents();
  const paymentsHook = usePayments();
  const billsHook = useBills();
  const transactionsHook = useTransactions();
  const enrollmentsHook = useEnrollments();

  // Check for overdue payments and bills on component mount and when data changes
  useEffect(() => {
    // This would be replaced with real database queries when implemented
    setIsLoading(true);
    
    // Update statuses (in the future, this would pull from a database)
    paymentsHook.updatePaymentStatuses();
    billsHook.updateBillStatuses();
    
    // Simulating API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // When migrating to a real database:
    // 1. Replace mock data imports with database queries
    // 2. Implement proper error handling for database operations
    // 3. Add caching strategies for frequently accessed data
    // 4. Implement real-time updates using subscriptions if available
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
