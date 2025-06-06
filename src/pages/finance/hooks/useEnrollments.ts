
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  modality: string;
  modalityName?: string;
  class: string;
  className?: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "cancelled";
  enrollmentFee: number;
  monthlyFee: number;
  paymentDay: number;
  notes?: string;
  date?: string; // For backward compatibility
  value?: number; // For backward compatibility
}

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          students (
            id,
            name
          ),
          modalities (
            id,
            name
          ),
          classes (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedEnrollments: Enrollment[] = data.map((enrollment: any) => ({
          id: enrollment.id,
          studentId: enrollment.student_id,
          studentName: enrollment.students?.name || 'Desconhecido',
          modality: enrollment.modality_id,
          modalityName: enrollment.modalities?.name || 'Desconhecida',
          class: enrollment.class_id,
          className: enrollment.classes?.name || 'Desconhecida',
          enrollmentDate: enrollment.enrollment_date,
          status: enrollment.status as "active" | "inactive" | "cancelled",
          enrollmentFee: enrollment.enrollment_fee,
          monthlyFee: enrollment.monthly_fee,
          paymentDay: enrollment.payment_day,
          notes: enrollment.notes,
          // For backward compatibility
          date: enrollment.enrollment_date,
          value: enrollment.enrollment_fee
        }));
        
        setEnrollments(formattedEnrollments);
      }
      
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch enrollments'));
      toast.error("Erro ao carregar matrículas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const addEnrollment = async (enrollmentData: any) => {
    setIsLoading(true);
    
    try {
      console.log("Adding enrollment with data:", enrollmentData);
      
      const dbEnrollment = {
        student_id: enrollmentData.studentId,
        modality_id: enrollmentData.modality,
        class_id: enrollmentData.class,
        enrollment_date: enrollmentData.enrollmentDate,
        status: enrollmentData.status || 'active',
        enrollment_fee: enrollmentData.enrollmentFee,
        monthly_fee: enrollmentData.monthlyFee,
        payment_day: enrollmentData.paymentDay,
        notes: enrollmentData.notes
      };
      
      console.log("Database enrollment object:", dbEnrollment);
      
      const { data, error } = await supabase
        .from('enrollments')
        .insert(dbEnrollment)
        .select(`
          *,
          students (
            id,
            name
          ),
          modalities (
            id,
            name
          ),
          classes (
            id,
            name
          )
        `)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newEnrollment: Enrollment = {
          id: data.id,
          studentId: data.student_id,
          studentName: data.students?.name || 'Desconhecido',
          modality: data.modality_id,
          modalityName: data.modalities?.name || 'Desconhecida',
          class: data.class_id,
          className: data.classes?.name || 'Desconhecida',
          enrollmentDate: data.enrollment_date,
          status: data.status as "active" | "inactive" | "cancelled",
          enrollmentFee: data.enrollment_fee,
          monthlyFee: data.monthly_fee,
          paymentDay: data.payment_day,
          notes: data.notes,
          date: data.enrollment_date,
          value: data.enrollment_fee
        };
        
        setEnrollments(prevEnrollments => [newEnrollment, ...prevEnrollments]);
        toast.success("Matrícula adicionada com sucesso");
        
        return data;
      }
      
    } catch (err) {
      console.error("Error adding enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to add enrollment'));
      toast.error("Erro ao adicionar matrícula");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEnrollment = async (id: string, updatedEnrollment: Partial<Enrollment>) => {
    setIsLoading(true);
    
    try {
      const dbEnrollment: any = {};
      
      if (updatedEnrollment.modality !== undefined) dbEnrollment.modality_id = updatedEnrollment.modality;
      if (updatedEnrollment.class !== undefined) dbEnrollment.class_id = updatedEnrollment.class;
      if (updatedEnrollment.enrollmentDate !== undefined) dbEnrollment.enrollment_date = updatedEnrollment.enrollmentDate;
      if (updatedEnrollment.status !== undefined) dbEnrollment.status = updatedEnrollment.status;
      if (updatedEnrollment.enrollmentFee !== undefined) dbEnrollment.enrollment_fee = updatedEnrollment.enrollmentFee;
      if (updatedEnrollment.monthlyFee !== undefined) dbEnrollment.monthly_fee = updatedEnrollment.monthlyFee;
      if (updatedEnrollment.paymentDay !== undefined) dbEnrollment.payment_day = updatedEnrollment.paymentDay;
      if (updatedEnrollment.notes !== undefined) dbEnrollment.notes = updatedEnrollment.notes;
      
      const { error } = await supabase
        .from('enrollments')
        .update(dbEnrollment)
        .eq('id', id);
      
      if (error) throw error;
      
      // Fetch updated data
      await fetchEnrollments();
      toast.success("Matrícula atualizada com sucesso");
      
    } catch (err) {
      console.error("Error updating enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to update enrollment'));
      toast.error("Erro ao atualizar matrícula");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEnrollment = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setEnrollments(prevEnrollments => 
        prevEnrollments.filter(enrollment => enrollment.id !== id)
      );
      
      toast.success("Matrícula removida com sucesso");
      
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete enrollment'));
      toast.error("Erro ao remover matrícula");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEnrollment = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      
      setEnrollments(prevEnrollments => 
        prevEnrollments.map(enrollment => 
          enrollment.id === id ? { ...enrollment, status: 'cancelled' as const } : enrollment
        )
      );
      
      toast.success("Matrícula cancelada com sucesso");
      
    } catch (err) {
      console.error("Error cancelling enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to cancel enrollment'));
      toast.error("Erro ao cancelar matrícula");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getEnrollmentsByStudent = (studentId: string) => {
    return enrollments.filter(enrollment => enrollment.studentId === studentId);
  };

  const getEnrollmentsByStatus = (status: "active" | "inactive" | "cancelled" | "all") => {
    if (status === "all") return enrollments;
    return enrollments.filter(enrollment => enrollment.status === status);
  };

  return {
    enrollments,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    cancelEnrollment,
    getEnrollmentsByStudent,
    getEnrollmentsByStatus,
    isLoading,
    error,
    refetch: fetchEnrollments
  };
};
