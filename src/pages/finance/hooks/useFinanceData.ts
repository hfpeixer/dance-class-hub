
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
 * This hook is designed to connect to a real database
 * and replace the mock data with actual database queries
 */
export const useFinanceData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const studentsHook = useStudents();
  const paymentsHook = usePayments();
  const billsHook = useBills();
  const transactionsHook = useTransactions();
  const enrollmentsHook = useEnrollments();

  // Check for overdue payments and bills on component mount and when data changes
  useEffect(() => {
    // This will be replaced with real database queries when implemented
    setIsLoading(true);
    setError(null);
    
    try {
      // Update statuses (in the future, this would pull from a database)
      paymentsHook.updatePaymentStatuses();
      billsHook.updateBillStatuses();
      
      // When connected to a real database, this is where we would fetch data
      // and update the respective state variables
      
      // Simulating API call delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
    
    // Database integration TODO:
    // 1. Replace mock data imports with database queries using an API client
    // 2. Implement proper error handling for database operations
    // 3. Add caching strategies for frequently accessed data
    // 4. Implement real-time updates using WebSockets or subscriptions if available
    // 5. Add pagination for large datasets
    // 6. Implement proper authentication and authorization checks
  }, []);

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
