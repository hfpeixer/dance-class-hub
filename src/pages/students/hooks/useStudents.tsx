
import { useState, useEffect, useMemo } from 'react';

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
  enrollmentDate?: string;
  notes?: string;
}

// Initial mock data
const initialStudents: Student[] = [
  {
    id: "1",
    name: "Ana Silva",
    age: 12,
    modality: "Ballet",
    class: "Ballet Infantil - Terça e Quinta",
    status: "active",
    email: "anasilva@email.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123",
    cityState: "São Paulo, SP",
    zipCode: "01234-567",
    birthday: "2011-05-15",
    parentName: "Maria Silva",
    parentPhone: "(11) 98765-4322",
    enrollmentDate: "2023-01-10",
    notes: "Aluna aplicada e dedicada."
  },
  {
    id: "2",
    name: "Lucas Oliveira",
    age: 14,
    modality: "Futsal",
    class: "Futsal Juvenil - Segunda e Quarta",
    status: "active",
    email: "lucasoliveira@email.com",
    phone: "(11) 98765-4323",
    address: "Av. Principal, 456",
    cityState: "São Paulo, SP",
    zipCode: "01234-568",
    birthday: "2009-08-20",
    parentName: "João Oliveira",
    parentPhone: "(11) 98765-4324",
    enrollmentDate: "2022-03-15",
    notes: "Participou do campeonato regional."
  },
  {
    id: "3",
    name: "Maria Santos",
    age: 10,
    modality: "Jazz",
    class: "Jazz Kids - Quarta e Sexta",
    status: "active",
    email: "mariasantos@email.com",
    phone: "(11) 98765-4325",
    address: "Rua do Comércio, 789",
    cityState: "São Paulo, SP",
    zipCode: "01234-569",
    birthday: "2013-03-10",
    parentName: "José Santos",
    parentPhone: "(11) 98765-4326",
    enrollmentDate: "2023-02-20",
    notes: "Demonstra grande talento para dança."
  },
  {
    id: "4",
    name: "Pedro Costa",
    age: 15,
    modality: "Ginástica",
    class: "Ginástica Artística - Terça e Quinta",
    status: "active",
    email: "pedrocosta@email.com",
    phone: "(11) 98765-4327",
    address: "Rua das Palmeiras, 101",
    cityState: "São Paulo, SP",
    zipCode: "01234-570",
    birthday: "2008-11-25",
    parentName: "Ana Costa",
    parentPhone: "(11) 98765-4328",
    enrollmentDate: "2021-09-05",
    notes: "Atleta com potencial para competições."
  },
  {
    id: "5",
    name: "Juliana Lima",
    age: 8,
    modality: "Ballet",
    class: "Ballet Infantil - Segunda e Quarta",
    status: "inactive",
    email: "julianalima@email.com",
    phone: "(11) 98765-4329",
    address: "Rua dos Girassóis, 222",
    cityState: "São Paulo, SP",
    zipCode: "01234-571",
    birthday: "2015-07-30",
    parentName: "Roberto Lima",
    parentPhone: "(11) 98765-4330",
    enrollmentDate: "2022-08-15",
    notes: "Está em processo de mudança de cidade."
  },
];

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Simulated loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter students based on search term and active filter
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Filter by search term
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        activeFilter === 'all' || 
        (activeFilter === 'active' && student.status === 'active') ||
        (activeFilter === 'inactive' && student.status === 'inactive');
      
      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, activeFilter]);

  // Add a new student
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString(), // Generate a unique ID
    } as Student;
    
    setStudents(prevStudents => [...prevStudents, newStudent]);
  };

  // Update an existing student
  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === id ? { ...student, ...studentData } : student
      )
    );
  };

  // Delete a student
  const deleteStudent = (id: string) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
  };

  // Toggle student status (active/inactive)
  const toggleStudentStatus = (id: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === id 
          ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' } 
          : student
      )
    );
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
    setActiveFilter
  };
}
