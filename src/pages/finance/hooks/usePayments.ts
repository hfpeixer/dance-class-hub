
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Payment } from "../models/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Payments data hook
 * Uses Supabase to fetch and manage payments data
 */
export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch payments from Supabase
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .select(`
            *,
            students (
              name
            )
          `);
        
        if (error) throw error;
        
        if (data) {
          const formattedPayments: Payment[] = data.map((payment: any) => ({
            id: payment.id,
            studentId: payment.student_id,
            studentName: payment.students?.name || 'Desconhecido',
            value: payment.value,
            date: payment.payment_date,
            description: payment.description,
            method: payment.method,
            category: payment.category || '',
            status: payment.status as "paid" | "pending" | "overdue" | "cancelled",
            dueDate: payment.due_date,
            notes: payment.notes,
            installments: payment.total_installments,
            currentInstallment: payment.installment_number
          }));
          
          setPayments(formattedPayments);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch payments'));
        setIsLoading(false);
        toast.error("Erro ao carregar pagamentos");
      }
    };
    
    fetchPayments();
  }, []);

  // Verify overdue payments daily
  useEffect(() => {
    updatePaymentStatuses();
  }, []);

  const updatePaymentStatuses = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
      // Get all pending payments
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      
      if (data) {
        for (const payment of data) {
          const dueDate = new Date(payment.due_date);
          dueDate.setHours(0, 0, 0, 0);
          
          if (dueDate < today) {
            // Update payment status to overdue in Supabase
            const { error: updateError } = await supabase
              .from('payments')
              .update({ status: 'overdue' })
              .eq('id', payment.id);
            
            if (updateError) throw updateError;
          }
        }
        
        // Refresh payments after updates
        const { data: updatedData, error: refreshError } = await supabase
          .from('payments')
          .select(`
            *,
            students (
              name
            )
          `);
        
        if (refreshError) throw refreshError;
        
        if (updatedData) {
          const formattedPayments: Payment[] = updatedData.map((payment: any) => ({
            id: payment.id,
            studentId: payment.student_id,
            studentName: payment.students?.name || 'Desconhecido',
            value: payment.value,
            date: payment.payment_date,
            description: payment.description,
            method: payment.method,
            category: payment.category || '',
            status: payment.status as "paid" | "pending" | "overdue" | "cancelled",
            dueDate: payment.due_date,
            notes: payment.notes,
            installments: payment.total_installments,
            currentInstallment: payment.installment_number
          }));
          
          setPayments(formattedPayments);
        }
      }
    } catch (err) {
      console.error("Error updating payment statuses:", err);
      setError(err instanceof Error ? err : new Error('Failed to update payment statuses'));
    }
  };

  const addPayment = async (payment: Omit<Payment, "id">) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
      const dbPayment = {
        student_id: payment.studentId,
        value: payment.value,
        payment_date: payment.date,
        description: payment.description,
        method: payment.method,
        category: payment.category,
        status: payment.status,
        due_date: payment.dueDate,
        notes: payment.notes,
        total_installments: payment.installments,
        installment_number: payment.currentInstallment,
        enrollment_id: null // Can be linked to enrollment if needed
      };
      
      const { data, error } = await supabase
        .from('payments')
        .insert(dbPayment)
        .select(`
          *,
          students (
            name
          )
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newPayment: Payment = {
          id: data[0].id,
          studentId: data[0].student_id,
          studentName: data[0].students?.name || 'Desconhecido',
          value: data[0].value,
          date: data[0].payment_date,
          description: data[0].description,
          method: data[0].method,
          category: data[0].category || '',
          status: data[0].status as "paid" | "pending" | "overdue" | "cancelled",
          dueDate: data[0].due_date,
          notes: data[0].notes,
          installments: data[0].total_installments,
          currentInstallment: data[0].installment_number
        };
        
        setPayments(prevPayments => [...prevPayments, newPayment]);
        toast.success("Pagamento adicionado com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding payment:", err);
      setError(err instanceof Error ? err : new Error('Failed to add payment'));
      setIsLoading(false);
      toast.error("Erro ao adicionar pagamento");
    }
  };

  const updatePayment = async (id: string, updatedPayment: Partial<Payment>) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
      const dbPayment: any = {};
      
      if (updatedPayment.value !== undefined) dbPayment.value = updatedPayment.value;
      if (updatedPayment.date !== undefined) dbPayment.payment_date = updatedPayment.date;
      if (updatedPayment.description !== undefined) dbPayment.description = updatedPayment.description;
      if (updatedPayment.method !== undefined) dbPayment.method = updatedPayment.method;
      if (updatedPayment.category !== undefined) dbPayment.category = updatedPayment.category;
      if (updatedPayment.status !== undefined) dbPayment.status = updatedPayment.status;
      if (updatedPayment.dueDate !== undefined) dbPayment.due_date = updatedPayment.dueDate;
      if (updatedPayment.notes !== undefined) dbPayment.notes = updatedPayment.notes;
      if (updatedPayment.installments !== undefined) dbPayment.total_installments = updatedPayment.installments;
      if (updatedPayment.currentInstallment !== undefined) dbPayment.installment_number = updatedPayment.currentInstallment;
      
      const { error } = await supabase
        .from('payments')
        .update(dbPayment)
        .eq('id', id);
      
      if (error) throw error;
      
      // Get updated payment with student name
      const { data: updatedData, error: fetchError } = await supabase
        .from('payments')
        .select(`
          *,
          students (
            name
          )
        `)
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (updatedData) {
        const updatedPaymentWithName: Payment = {
          id: updatedData.id,
          studentId: updatedData.student_id,
          studentName: updatedData.students?.name || 'Desconhecido',
          value: updatedData.value,
          date: updatedData.payment_date,
          description: updatedData.description,
          method: updatedData.method,
          category: updatedData.category || '',
          status: updatedData.status as "paid" | "pending" | "overdue" | "cancelled",
          dueDate: updatedData.due_date,
          notes: updatedData.notes,
          installments: updatedData.total_installments,
          currentInstallment: updatedData.installment_number
        };
        
        setPayments(prevPayments => 
          prevPayments.map(payment => 
            payment.id === id ? updatedPaymentWithName : payment
          )
        );
        
        toast.success("Pagamento atualizado com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating payment:", err);
      setError(err instanceof Error ? err : new Error('Failed to update payment'));
      setIsLoading(false);
      toast.error("Erro ao atualizar pagamento");
    }
  };

  const deletePayment = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPayments(prevPayments => 
        prevPayments.filter(payment => payment.id !== id)
      );
      
      toast.success("Pagamento removido com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete payment'));
      setIsLoading(false);
      toast.error("Erro ao remover pagamento");
    }
  };

  const markAsPaid = async (id: string, method: string) => {
    setIsLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          payment_date: today,
          method: method
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === id ? {
            ...payment,
            status: 'paid',
            date: today,
            method: method
          } : payment
        )
      );
      
      toast.success("Pagamento marcado como pago");
      setIsLoading(false);
    } catch (err) {
      console.error("Error marking payment as paid:", err);
      setError(err instanceof Error ? err : new Error('Failed to mark payment as paid'));
      setIsLoading(false);
      toast.error("Erro ao marcar pagamento como pago");
    }
  };

  const getPaymentsByStudent = (studentId: string) => {
    return payments.filter(payment => payment.studentId === studentId);
  };

  const getPaymentsByStatus = (status: "paid" | "pending" | "overdue" | "all") => {
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
