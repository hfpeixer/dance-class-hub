
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the student interface
export interface Student {
  id: string;
  name: string;
  age: number;
  modality: string;
  class: string;
  status: 'active' | 'inactive';
  // Extended fields
  email?: string;
  phone?: string;
  address?: string;
  cityState?: string;
  zipCode?: string;
  birthday?: string;
  parentName?: string;
  parentPhone?: string;
  parentCPF?: string;
  enrollmentDate?: string;
  notes?: string;
  modalities?: string[];
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [error, setError] = useState<Error | null>(null);

  // Fetch students from Supabase
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) {
        console.error("Supabase error fetching students:", error);
        throw error;
      }
      
      if (data) {
        const formattedStudents = data.map((student: any) => ({
          id: student.id,
          name: student.name,
          age: student.age || 0,
          modality: student.modality || '',
          class: student.class || '',
          status: student.status as 'active' | 'inactive',
          email: student.email,
          phone: student.phone,
          address: student.address,
          cityState: student.city_state,
          zipCode: student.zip_code,
          birthday: student.birthday,
          parentName: student.parent_name,
          parentPhone: student.parent_phone,
          parentCPF: student.parent_cpf,
          enrollmentDate: student.enrollment_date,
          notes: student.notes,
          // For backward compatibility with mock data
          modalities: student.modality ? [student.modality] : []
        }));
        
        setStudents(formattedStudents);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch students'));
      toast.error("Erro ao carregar alunos");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term and active filter
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Filter by search term
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.modality && student.modality.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by status
      const matchesStatus = 
        activeFilter === 'all' || 
        (activeFilter === 'active' && student.status === 'active') ||
        (activeFilter === 'inactive' && student.status === 'inactive');
      
      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, activeFilter]);

  // Add a new student
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format with proper null handling for dates
      const dbStudent = {
        name: studentData.name,
        age: studentData.age,
        modality: studentData.modalities ? studentData.modalities[0] : '',
        class: studentData.class || '',
        status: studentData.status || 'active',
        email: studentData.email || '',
        phone: studentData.phone || '',
        address: studentData.address || '',
        city_state: studentData.cityState || '',
        zip_code: studentData.zipCode || '',
        // Handle date fields - use null instead of empty string
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
        
        setStudents(prevStudents => [...prevStudents, newStudent]);
        toast.success("Aluno adicionado com sucesso!");
      }
    } catch (err) {
      console.error("Error adding student:", err);
      toast.error("Erro ao adicionar aluno");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing student
  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format with proper null handling for dates
      const dbStudent: any = {};
      
      if (studentData.name !== undefined) dbStudent.name = studentData.name;
      if (studentData.age !== undefined) dbStudent.age = studentData.age;
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
      
      // Update modality if modalities array is provided
      if (studentData.modalities && studentData.modalities.length > 0) {
        dbStudent.modality = studentData.modalities[0];
      }
      if (studentData.class !== undefined) dbStudent.class = studentData.class;
      
      console.log("Updating student with ID:", id, "Data:", dbStudent);
      
      const { error } = await supabase
        .from('students')
        .update(dbStudent)
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error updating student:", error);
        throw error;
      }
      
      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(student => {
          if (student.id === id) {
            // Update modality if modalities array is provided
            const updatedStudent = { ...student, ...studentData };
            if (studentData.modalities && studentData.modalities.length > 0) {
              updatedStudent.modality = studentData.modalities[0];
            }
            return updatedStudent;
          }
          return student;
        })
      );
      
      toast.success("Aluno atualizado com sucesso!");
    } catch (err) {
      console.error("Error updating student:", err);
      toast.error("Erro ao atualizar aluno");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a student
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
      
      setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
      toast.success("Aluno removido com sucesso!");
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.error("Erro ao excluir aluno");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle student status (active/inactive)
  const toggleStudentStatus = async (id: string) => {
    try {
      // First, get the current status
      const student = students.find(s => s.id === id);
      if (!student) return;
      
      const newStatus = student.status === 'active' ? 'inactive' : 'active';
      
      console.log("Toggling student status:", id, "to", newStatus);
      
      // Update in Supabase
      const { error } = await supabase
        .from('students')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error toggling status:", error);
        throw error;
      }
      
      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id 
            ? { ...student, status: newStatus as 'active' | 'inactive' } 
            : student
        )
      );
      
      toast.success(`Status do aluno alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}`);
    } catch (err) {
      console.error("Error toggling student status:", err);
      toast.error("Erro ao alterar status do aluno");
    }
  };

  return {
    students,
    filteredStudents,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    error,
    refetch: fetchStudents
  };
}
