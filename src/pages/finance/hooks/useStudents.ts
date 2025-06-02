import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Student } from "../models/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Students data hook
 * Uses Supabase to fetch and manage student data
 */
export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch students from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          const formattedStudents: Student[] = data.map((student: any) => ({
            id: student.id,
            name: student.name,
            email: student.email || '',
            phone: student.phone || '',
            age: student.age || 0,
            birthday: student.birthday || '',
            modality: student.modality || '',
            class: student.class || '',
            status: student.status as "active" | "inactive",
            address: student.address || '',
            cityState: student.city_state || '',
            zipCode: student.zip_code || '',
            parentName: student.parent_name || '',
            parentPhone: student.parent_phone || '',
            parentCPF: student.parent_cpf || '',
            enrollmentDate: student.enrollment_date || '',
            notes: student.notes || ''
          }));
          
          setStudents(formattedStudents);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch students'));
        setIsLoading(false);
        toast.error("Erro ao carregar alunos");
      }
    };
    
    fetchStudents();
  }, []);

  const addStudent = async (student: Omit<Student, "id">) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format with proper null handling for dates
      const dbStudent = {
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        birthday: student.birthday && student.birthday.trim() !== '' ? student.birthday : null,
        modality: student.modality,
        class: student.class,
        status: student.status,
        address: student.address,
        city_state: student.cityState,
        zip_code: student.zipCode,
        parent_name: student.parentName,
        parent_phone: student.parentPhone,
        parent_cpf: student.parentCPF,
        enrollment_date: student.enrollmentDate && student.enrollmentDate.trim() !== '' ? student.enrollmentDate : null,
        notes: student.notes
      };
      
      const { data, error } = await supabase
        .from('students')
        .insert(dbStudent)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newStudent: Student = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email || '',
          phone: data[0].phone || '',
          age: data[0].age || 0,
          birthday: data[0].birthday || '',
          modality: data[0].modality || '',
          class: data[0].class || '',
          status: data[0].status as "active" | "inactive",
          address: data[0].address || '',
          cityState: data[0].city_state || '',
          zipCode: data[0].zip_code || '',
          parentName: data[0].parent_name || '',
          parentPhone: data[0].parent_phone || '',
          parentCPF: data[0].parent_cpf || '',
          enrollmentDate: data[0].enrollment_date || '',
          notes: data[0].notes || ''
        };
        
        setStudents(prevStudents => [...prevStudents, newStudent]);
        toast.success("Aluno adicionado com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err instanceof Error ? err : new Error('Failed to add student'));
      setIsLoading(false);
      toast.error("Erro ao adicionar aluno");
    }
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format with proper null handling for dates
      const dbStudent: any = {};
      
      if (updatedStudent.name !== undefined) dbStudent.name = updatedStudent.name;
      if (updatedStudent.email !== undefined) dbStudent.email = updatedStudent.email;
      if (updatedStudent.phone !== undefined) dbStudent.phone = updatedStudent.phone;
      if (updatedStudent.age !== undefined) dbStudent.age = updatedStudent.age;
      if (updatedStudent.birthday !== undefined) {
        dbStudent.birthday = updatedStudent.birthday && updatedStudent.birthday.trim() !== '' ? updatedStudent.birthday : null;
      }
      if (updatedStudent.modality !== undefined) dbStudent.modality = updatedStudent.modality;
      if (updatedStudent.class !== undefined) dbStudent.class = updatedStudent.class;
      if (updatedStudent.status !== undefined) dbStudent.status = updatedStudent.status;
      if (updatedStudent.address !== undefined) dbStudent.address = updatedStudent.address;
      if (updatedStudent.cityState !== undefined) dbStudent.city_state = updatedStudent.cityState;
      if (updatedStudent.zipCode !== undefined) dbStudent.zip_code = updatedStudent.zipCode;
      if (updatedStudent.parentName !== undefined) dbStudent.parent_name = updatedStudent.parentName;
      if (updatedStudent.parentPhone !== undefined) dbStudent.parent_phone = updatedStudent.parentPhone;
      if (updatedStudent.parentCPF !== undefined) dbStudent.parent_cpf = updatedStudent.parentCPF;
      if (updatedStudent.enrollmentDate !== undefined) {
        dbStudent.enrollment_date = updatedStudent.enrollmentDate && updatedStudent.enrollmentDate.trim() !== '' ? updatedStudent.enrollmentDate : null;
      }
      if (updatedStudent.notes !== undefined) dbStudent.notes = updatedStudent.notes;
      
      const { error } = await supabase
        .from('students')
        .update(dbStudent)
        .eq('id', id);
      
      if (error) throw error;
      
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id ? { ...student, ...updatedStudent } : student
        )
      );
      
      toast.success("Aluno atualizado com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating student:", err);
      setError(err instanceof Error ? err : new Error('Failed to update student'));
      setIsLoading(false);
      toast.error("Erro ao atualizar aluno");
    }
  };

  const deleteStudent = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== id)
      );
      
      toast.success("Aluno removido com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting student:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete student'));
      setIsLoading(false);
      toast.error("Erro ao remover aluno");
    }
  };

  const toggleStudentStatus = async (id: string) => {
    try {
      const student = students.find(s => s.id === id);
      if (!student) return;
      
      const newStatus = student.status === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from('students')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id ? { ...student, status: newStatus } : student
        )
      );
      
      toast.success(`Aluno ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (err) {
      console.error("Error toggling student status:", err);
      setError(err instanceof Error ? err : new Error('Failed to toggle student status'));
      toast.error("Erro ao alterar status do aluno");
    }
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const getStudentsByStatus = (status: "active" | "inactive" | "all") => {
    if (status === "all") return students;
    return students.filter(student => student.status === status);
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    getStudentById,
    getStudentsByStatus,
    isLoading,
    error
  };
};
