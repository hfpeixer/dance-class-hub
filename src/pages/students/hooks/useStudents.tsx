
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useStudentOperations } from './useStudentOperations';

export interface Student {
  id: string;
  name: string;
  age: number;
  modality: string;
  class: string;
  status: 'active' | 'inactive';
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

  const operations = useStudentOperations();

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.modality && student.modality.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        activeFilter === 'all' || 
        (activeFilter === 'active' && student.status === 'active') ||
        (activeFilter === 'inactive' && student.status === 'inactive');
      
      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, activeFilter]);

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const newStudent = await operations.addStudent(studentData);
    if (newStudent) {
      setStudents(prevStudents => [...prevStudents, newStudent]);
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    const updatedData = await operations.updateStudent(id, studentData);
    if (updatedData) {
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id ? { ...student, ...updatedData } : student
        )
      );
    }
  };

  const deleteStudent = async (id: string) => {
    await operations.deleteStudent(id);
    setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
  };

  const toggleStudentStatus = async (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      const newStatus = await operations.toggleStudentStatus(id, student.status);
      if (newStatus) {
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student.id === id 
              ? { ...student, status: newStatus as 'active' | 'inactive' } 
              : student
          )
        );
      }
    }
  };

  return {
    students,
    filteredStudents,
    isLoading: isLoading || operations.isLoading,
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
