
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Student } from "../models/types";
import { STUDENTS } from "../models/mockData";

/**
 * Students data hook
 * In production, this would fetch data from a database
 */
export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simulated data fetching effect - will be replaced with real API calls
  useEffect(() => {
    // In production, this would be an API call to fetch students
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // In production: const response = await apiClient.get('/students');
        // setStudents(response.data);
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch students'));
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const addStudent = (student: Omit<Student, "id">) => {
    const newStudent = {
      ...student,
      id: uuidv4()
    };
    
    // In production: API call to create student
    // const addStudentToDb = async () => {
    //   try {
    //     const response = await apiClient.post('/students', newStudent);
    //     setStudents(prev => [...prev, response.data]);
    //     return response.data;
    //   } catch (error) {
    //     setError(error);
    //     throw error;
    //   }
    // };
    
    // For now, just update local state
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    // In production: API call to update student
    // const updateStudentInDb = async () => {
    //   try {
    //     const response = await apiClient.put(`/students/${id}`, updatedStudent);
    //     setStudents(prev => prev.map(student => 
    //       student.id === id ? response.data : student
    //     ));
    //     return response.data;
    //   } catch (error) {
    //     setError(error);
    //     throw error;
    //   }
    // };
    
    // For now, just update local state
    setStudents(students.map((student) => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    // In production: API call to delete student
    // const deleteStudentFromDb = async () => {
    //   try {
    //     await apiClient.delete(`/students/${id}`);
    //     setStudents(prev => prev.filter(student => student.id !== id));
    //   } catch (error) {
    //     setError(error);
    //     throw error;
    //   }
    // };
    
    // For now, just update local state
    setStudents(students.filter((student) => student.id !== id));
  };

  const toggleStudentStatus = (id: string) => {
    // In production: API call to toggle status
    setStudents(students.map((student) => 
      student.id === id ? {
        ...student,
        status: student.status === "active" ? "inactive" : "active"
      } : student
    ));
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
