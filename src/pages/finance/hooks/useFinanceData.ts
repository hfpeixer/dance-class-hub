
import { useState, useEffect } from "react";
import { useStudents } from "./useStudents";
import { usePayments } from "./usePayments";
import { useBills } from "./useBills";
import { useTransactions } from "./useTransactions";
import { useEnrollments } from "./useEnrollments";

// Re-export from models for backward compatibility
export * from "../models/types";
export * from "../models/constants";

// Define the constants that were previously exported
export const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Água",
  "Energia",
  "Internet",
  "Telefone",
  "Marketing",
  "Manutenção",
  "Salários",
  "Impostos",
  "Material de Escritório",
  "Material Didático",
  "Eventos",
  "Outros"
];

export const PAYMENT_METHODS = [
  "Dinheiro",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Transferência Bancária",
  "PIX",
  "Boleto",
  "Outros"
];

export const SUPPLIERS = [
  { id: "1", name: "Fornecedor de Material Didático" },
  { id: "2", name: "Aluguel do Estúdio" },
  { id: "3", name: "Serviços de Limpeza" },
  { id: "4", name: "Manutenção Predial" },
  { id: "5", name: "Serviços de Contabilidade" },
  { id: "6", name: "Distribuidor de Água" },
  { id: "7", name: "Companhia de Energia" },
  { id: "8", name: "Provedor de Internet" },
  { id: "9", name: "Fornecedor de Figurinos" },
  { id: "10", name: "Outros" }
];

// Temporary mock data until we create these tables
export const MODALITIES = [
  { id: "1", name: "Ballet Infantil", description: "Ballet para crianças de 3 a 6 anos", monthlyFee: 150, enrollmentFee: 50 },
  { id: "2", name: "Ballet Juvenil", description: "Ballet para crianças de 7 a 12 anos", monthlyFee: 180, enrollmentFee: 60 },
  { id: "3", name: "Ballet Adulto", description: "Ballet para adultos", monthlyFee: 200, enrollmentFee: 70 },
  { id: "4", name: "Jazz", description: "Jazz para todas as idades", monthlyFee: 170, enrollmentFee: 50 },
  { id: "5", name: "Dança Contemporânea", description: "Dança contemporânea para todas as idades", monthlyFee: 190, enrollmentFee: 60 }
];

export const CLASSES = [
  { id: "1", name: "Ballet Infantil - Segunda e Quarta 15h", modalityId: "1", schedule: "Segunda e Quarta 15h-16h", teacher: "Profa. Ana", maxStudents: 15, currentStudents: 8 },
  { id: "2", name: "Ballet Infantil - Terça e Quinta 14h", modalityId: "1", schedule: "Terça e Quinta 14h-15h", teacher: "Profa. Ana", maxStudents: 15, currentStudents: 10 },
  { id: "3", name: "Ballet Juvenil - Segunda e Quarta 16h", modalityId: "2", schedule: "Segunda e Quarta 16h-17h30", teacher: "Profa. Beatriz", maxStudents: 18, currentStudents: 12 },
  { id: "4", name: "Ballet Adulto - Terça e Quinta 19h", modalityId: "3", schedule: "Terça e Quinta 19h-20h30", teacher: "Prof. Carlos", maxStudents: 20, currentStudents: 15 },
  { id: "5", name: "Jazz - Sexta 16h e Sábado 10h", modalityId: "4", schedule: "Sexta 16h-17h30 e Sábado 10h-11h30", teacher: "Profa. Daniela", maxStudents: 18, currentStudents: 9 },
  { id: "6", name: "Dança Contemporânea - Segunda e Quarta 19h", modalityId: "5", schedule: "Segunda e Quarta 19h-20h30", teacher: "Prof. Eduardo", maxStudents: 15, currentStudents: 7 }
];

// Export a mock array of students for components that need it
export const STUDENTS = [];

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

  // Update the STUDENTS array whenever studentsHook.students changes
  useEffect(() => {
    if (studentsHook.students) {
      // @ts-ignore - This is needed for backward compatibility
      STUDENTS.length = 0;
      // @ts-ignore - We're using this array in a special way for component compatibility
      STUDENTS.push(...studentsHook.students);
    }
  }, [studentsHook.students]);

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
