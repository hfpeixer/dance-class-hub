
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Student } from "../models/types";
import { STUDENTS } from "../models/mockData";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(STUDENTS);

  const addStudent = (student: Omit<Student, "id">) => {
    const newStudent = {
      ...student,
      id: uuidv4()
    };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(students.map((student) => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const toggleStudentStatus = (id: string) => {
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
    getStudentsByStatus
  };
};
