
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Enrollment } from '../models/types';
import { ENROLLMENTS } from '../models/mockData';

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(ENROLLMENTS);

  const addEnrollment = (enrollment: Omit<Enrollment, 'id'>) => {
    const newEnrollment = { 
      ...enrollment, 
      id: uuidv4(),
      date: enrollment.startDate // Ensure date is set for sorting
    };
    setEnrollments([...enrollments, newEnrollment]);
  };

  const updateEnrollment = (id: string, updatedEnrollment: Omit<Enrollment, 'id'>) => {
    setEnrollments(
      enrollments.map((enrollment) =>
        enrollment.id === id ? { ...enrollment, ...updatedEnrollment, id } : enrollment
      )
    );
  };

  const deleteEnrollment = (id: string) => {
    setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id));
  };

  const cancelEnrollment = (id: string) => {
    setEnrollments(
      enrollments.map((enrollment) =>
        enrollment.id === id ? { 
          ...enrollment, 
          status: "inactive", 
          endDate: new Date().toISOString().split('T')[0] 
        } : enrollment
      )
    );
  };

  return {
    enrollments,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    cancelEnrollment
  };
};
