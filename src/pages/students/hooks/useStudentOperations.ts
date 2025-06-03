
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Student } from './useStudents';

export function useStudentOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    setIsLoading(true);
    
    try {
      const dbStudent = {
        name: studentData.name,
        modality: studentData.modalities ? studentData.modalities[0] : '',
        class: studentData.class || '',
        status: studentData.status || 'active',
        email: studentData.email || '',
        phone: studentData.phone || '',
        address: studentData.address || '',
        city_state: studentData.cityState || '',
        zip_code: studentData.zipCode || '',
        birthday: studentData.birthday && studentData.birthday.trim() !== '' ? studentData.birthday : null,
        parent_name: studentData.parentName || '',
        parent_phone: studentData.parentPhone || '',
        parent_cpf: studentData.parentCPF || '',
        enrollment_date: studentData.enrollmentDate && studentData.enrollmentDate.trim() !== '' ? studentData.enrollmentDate : null,
        notes: studentData.notes || ''
      };
      
      console.log("Inserting student data:", dbStudent);
      
      const { data, error } = await supabase
        .from('students')
        .insert(dbStudent)
        .select();
      
      if (error) {
        console.error("Error adding student:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const newStudent = {
          id: data[0].id,
          name: data[0].name,
          age: data[0].age || 0,
          modality: data[0].modality || '',
          class: data[0].class || '',
          status: data[0].status as 'active' | 'inactive',
          email: data[0].email || '',
          phone: data[0].phone || '',
          address: data[0].address || '',
          cityState: data[0].city_state || '',
          zipCode: data[0].zip_code || '',
          birthday: data[0].birthday || '',
          parentName: data[0].parent_name || '',
          parentPhone: data[0].parent_phone || '',
          parentCPF: data[0].parent_cpf || '',
          enrollmentDate: data[0].enrollment_date || '',
          notes: data[0].notes || '',
          modalities: data[0].modality ? [data[0].modality] : []
        };
        
        toast.success("Aluno adicionado com sucesso!");
        return newStudent;
      }
    } catch (err) {
      console.error("Error adding student:", err);
      toast.error("Erro ao adicionar aluno");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    setIsLoading(true);
    
    try {
      const dbStudent: any = {};
      
      if (studentData.name !== undefined) dbStudent.name = studentData.name;
      if (studentData.status !== undefined) dbStudent.status = studentData.status;
      if (studentData.email !== undefined) dbStudent.email = studentData.email;
      if (studentData.phone !== undefined) dbStudent.phone = studentData.phone;
      if (studentData.address !== undefined) dbStudent.address = studentData.address;
      if (studentData.cityState !== undefined) dbStudent.city_state = studentData.cityState;
      if (studentData.zipCode !== undefined) dbStudent.zip_code = studentData.zipCode;
      if (studentData.birthday !== undefined) {
        dbStudent.birthday = studentData.birthday && studentData.birthday.trim() !== '' ? studentData.birthday : null;
      }
      if (studentData.parentName !== undefined) dbStudent.parent_name = studentData.parentName;
      if (studentData.parentPhone !== undefined) dbStudent.parent_phone = studentData.parentPhone;
      if (studentData.parentCPF !== undefined) dbStudent.parent_cpf = studentData.parentCPF;
      if (studentData.enrollmentDate !== undefined) {
        dbStudent.enrollment_date = studentData.enrollmentDate && studentData.enrollmentDate.trim() !== '' ? studentData.enrollmentDate : null;
      }
      if (studentData.notes !== undefined) dbStudent.notes = studentData.notes;
      
      if (studentData.modalities && studentData.modalities.length > 0) {
        dbStudent.modality = studentData.modalities[0];
      }
      if (studentData.class !== undefined) dbStudent.class = studentData.class;
      
      console.log("Updating student with ID:", id, "Data:", dbStudent);
      
      const { data, error } = await supabase
        .from('students')
        .update(dbStudent)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error("Supabase error updating student:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const updatedStudent = {
          ...studentData,
          age: data[0].age || 0,
          modality: studentData.modalities && studentData.modalities.length > 0 
            ? studentData.modalities[0] 
            : studentData.modality
        };
        
        toast.success("Aluno atualizado com sucesso!");
        return updatedStudent;
      }
    } catch (err) {
      console.error("Error updating student:", err);
      toast.error("Erro ao atualizar aluno");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setIsLoading(true);
    
    try {
      console.log("Deleting student with ID:", id);
      
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error deleting student:", error);
        throw error;
      }
      
      toast.success("Aluno removido com sucesso!");
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.error("Erro ao excluir aluno");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStudentStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      console.log("Toggling student status:", id, "to", newStatus);
      
      const { error } = await supabase
        .from('students')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error toggling status:", error);
        throw error;
      }
      
      toast.success(`Status do aluno alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}`);
      return newStatus;
    } catch (err) {
      console.error("Error toggling student status:", err);
      toast.error("Erro ao alterar status do aluno");
      throw err;
    }
  };

  return {
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    isLoading
  };
}
