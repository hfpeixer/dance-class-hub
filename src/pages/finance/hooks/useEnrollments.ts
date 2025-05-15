
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Enrollment } from "../models/types";
import { ENROLLMENTS } from "../models/mockData";

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(ENROLLMENTS);

  const addEnrollment = (enrollment: Omit<Enrollment, "id">) => {
    const newEnrollment = {
      ...enrollment,
      id: uuidv4()
    };
    setEnrollments([...enrollments, newEnrollment]);
    return newEnrollment;
  };

  const updateEnrollment = (id: string, updatedEnrollment: Partial<Enrollment>) => {
    setEnrollments(enrollments.map((enrollment) => 
      enrollment.id === id ? { ...enrollment, ...updatedEnrollment } : enrollment
    ));
  };

  const deleteEnrollment = (id: string) => {
    setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id));
  };

  const cancelEnrollment = (id: string) => {
    setEnrollments(enrollments.map((enrollment) => 
      enrollment.id === id ? { ...enrollment, status: 'cancelled' } : enrollment
    ));
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
    getEnrollmentsByStatus
  };
};
