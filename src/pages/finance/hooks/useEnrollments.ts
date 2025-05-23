
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Enrollment } from "../models/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch enrollments from Supabase
  useEffect(() => {
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
          `);
        
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
            notes: enrollment.notes
          }));
          
          setEnrollments(formattedEnrollments);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch enrollments'));
        setIsLoading(false);
        toast.error("Erro ao carregar matrículas");
      }
    };
    
    fetchEnrollments();
  }, []);

  const addEnrollment = async (enrollment: Omit<Enrollment, "id">) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
      const dbEnrollment = {
        student_id: enrollment.studentId,
        modality_id: enrollment.modality,
        class_id: enrollment.class,
        enrollment_date: enrollment.enrollmentDate || enrollment.date,
        status: enrollment.status,
        enrollment_fee: enrollment.enrollmentFee,
        monthly_fee: enrollment.monthlyFee,
        payment_day: enrollment.paymentDay,
        notes: enrollment.notes
      };
      
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
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newEnrollment: Enrollment = {
          id: data[0].id,
          studentId: data[0].student_id,
          studentName: data[0].students?.name || 'Desconhecido',
          modality: data[0].modality_id,
          modalityName: data[0].modalities?.name || 'Desconhecida',
          class: data[0].class_id,
          className: data[0].classes?.name || 'Desconhecida',
          enrollmentDate: data[0].enrollment_date,
          status: data[0].status as "active" | "inactive" | "cancelled",
          enrollmentFee: data[0].enrollment_fee,
          monthlyFee: data[0].monthly_fee,
          paymentDay: data[0].payment_day,
          notes: data[0].notes
        };
        
        setEnrollments(prevEnrollments => [...prevEnrollments, newEnrollment]);
        toast.success("Matrícula adicionada com sucesso");
      }
      
      setIsLoading(false);
      return data?.[0];
    } catch (err) {
      console.error("Error adding enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to add enrollment'));
      setIsLoading(false);
      toast.error("Erro ao adicionar matrícula");
      return null;
    }
  };

  const updateEnrollment = async (id: string, updatedEnrollment: Partial<Enrollment>) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
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
      
      // Get updated enrollment with related data
      const { data: updatedData, error: fetchError } = await supabase
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
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (updatedData) {
        const updatedEnrollmentWithNames: Enrollment = {
          id: updatedData.id,
          studentId: updatedData.student_id,
          studentName: updatedData.students?.name || 'Desconhecido',
          modality: updatedData.modality_id,
          modalityName: updatedData.modalities?.name || 'Desconhecida',
          class: updatedData.class_id,
          className: updatedData.classes?.name || 'Desconhecida',
          enrollmentDate: updatedData.enrollment_date,
          status: updatedData.status as "active" | "inactive" | "cancelled",
          enrollmentFee: updatedData.enrollment_fee,
          monthlyFee: updatedData.monthly_fee,
          paymentDay: updatedData.payment_day,
          notes: updatedData.notes
        };
        
        setEnrollments(prevEnrollments => 
          prevEnrollments.map(enrollment => 
            enrollment.id === id ? updatedEnrollmentWithNames : enrollment
          )
        );
        
        toast.success("Matrícula atualizada com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to update enrollment'));
      setIsLoading(false);
      toast.error("Erro ao atualizar matrícula");
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
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete enrollment'));
      setIsLoading(false);
      toast.error("Erro ao remover matrícula");
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
          enrollment.id === id ? { ...enrollment, status: 'cancelled' } : enrollment
        )
      );
      
      toast.success("Matrícula cancelada com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error cancelling enrollment:", err);
      setError(err instanceof Error ? err : new Error('Failed to cancel enrollment'));
      setIsLoading(false);
      toast.error("Erro ao cancelar matrícula");
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
    error
  };
};
