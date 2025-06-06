import { useState, useEffect } from "react";
import { usePayments } from "./usePayments";
import { useTransactions } from "./useTransactions";
import { useBills } from "./useBills";
import { useEnrollments } from "./useEnrollments";
import { useMonthlyFees } from "./useMonthlyFees";

export const useFinanceData = () => {
  const payments = usePayments();
  const transactions = useTransactions();
  const bills = useBills();
  const enrollments = useEnrollments();
  const monthlyFees = useMonthlyFees();

  return {
    ...payments,
    ...transactions,
    ...bills,
    ...enrollments,
    
    // Add monthly fees functionality
    monthlyFees: monthlyFees.monthlyFees,
    markMonthlyFeeAsPaid: monthlyFees.markAsPaid,
    updateOverdueMonthlyFees: monthlyFees.updateOverdueStatus,
    getMonthlyFeesByStudent: monthlyFees.getMonthlyFeesByStudent,
    getMonthlyFeesByStatus: monthlyFees.getMonthlyFeesByStatus,
    getMonthlyFeesByEnrollment: monthlyFees.getMonthlyFeesByEnrollment,
    refetchMonthlyFees: monthlyFees.refetch
  };
};
