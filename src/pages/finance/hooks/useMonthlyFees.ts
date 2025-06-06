
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MonthlyFee {
  id: string;
  enrollment_id: string;
  student_id: string;
  amount: number;
  due_date: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  payment_date?: string;
  payment_method?: string;
  month_year: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Related data
  student_name?: string;
  enrollment?: any;
}

export const useMonthlyFees = () => {
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMonthlyFees = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('monthly_fees')
        .select(`
          *,
          students (
            id,
            name
          ),
          enrollments (
            id,
            modality_id,
            class_id,
            modalities (
              id,
              name
            ),
            classes (
              id,
              name
            )
          )
        `)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const formattedFees: MonthlyFee[] = data.map((fee: any) => ({
          id: fee.id,
          enrollment_id: fee.enrollment_id,
          student_id: fee.student_id,
          amount: fee.amount,
          due_date: fee.due_date,
          status: fee.status,
          payment_date: fee.payment_date,
          payment_method: fee.payment_method,
          month_year: fee.month_year,
          notes: fee.notes,
          created_at: fee.created_at,
          updated_at: fee.updated_at,
          student_name: fee.students?.name || 'Desconhecido',
          enrollment: fee.enrollments
        }));
        
        setMonthlyFees(formattedFees);
      }
      
    } catch (err) {
      console.error("Error fetching monthly fees:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch monthly fees'));
      toast.error("Erro ao carregar mensalidades");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPaid = async (id: string, paymentMethod: string = "Dinheiro") => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('monthly_fees')
        .update({ 
          status: 'paid',
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setMonthlyFees(prevFees => 
        prevFees.map(fee => 
          fee.id === id 
            ? { 
                ...fee, 
                status: 'paid' as const,
                payment_date: new Date().toISOString().split('T')[0],
                payment_method: paymentMethod
              } 
            : fee
        )
      );
      
      toast.success("Mensalidade marcada como paga");
      
    } catch (err) {
      console.error("Error marking monthly fee as paid:", err);
      setError(err instanceof Error ? err : new Error('Failed to mark as paid'));
      toast.error("Erro ao marcar mensalidade como paga");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOverdueStatus = async () => {
    try {
      const { error } = await supabase.rpc('update_overdue_monthly_fees');
      
      if (error) throw error;
      
      // Refresh the data to show updated statuses
      await fetchMonthlyFees();
      
    } catch (err) {
      console.error("Error updating overdue status:", err);
      // Don't show error to user as this is a background operation
    }
  };

  const getMonthlyFeesByStudent = (studentId: string) => {
    return monthlyFees.filter(fee => fee.student_id === studentId);
  };

  const getMonthlyFeesByStatus = (status: "pending" | "paid" | "overdue" | "cancelled" | "all") => {
    if (status === "all") return monthlyFees;
    return monthlyFees.filter(fee => fee.status === status);
  };

  const getMonthlyFeesByEnrollment = (enrollmentId: string) => {
    return monthlyFees.filter(fee => fee.enrollment_id === enrollmentId);
  };

  useEffect(() => {
    fetchMonthlyFees();
    // Update overdue status on load
    updateOverdueStatus();
  }, []);

  return {
    monthlyFees,
    isLoading,
    error,
    markAsPaid,
    updateOverdueStatus,
    getMonthlyFeesByStudent,
    getMonthlyFeesByStatus,
    getMonthlyFeesByEnrollment,
    refetch: fetchMonthlyFees
  };
};
