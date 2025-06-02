
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Teacher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  salary?: number;
  hire_date?: string;
  status: "active" | "inactive";
  notes?: string;
  created_at?: string;
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          const formattedTeachers: Teacher[] = data.map((teacher: any) => ({
            id: teacher.id,
            name: teacher.name,
            email: teacher.email || '',
            phone: teacher.phone || '',
            specialties: teacher.specialties || [],
            salary: teacher.salary || 0,
            hire_date: teacher.hire_date || '',
            status: teacher.status as "active" | "inactive",
            notes: teacher.notes || '',
            created_at: teacher.created_at
          }));
          
          setTeachers(formattedTeachers);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch teachers'));
        setIsLoading(false);
        toast.error("Erro ao carregar professores");
      }
    };
    
    fetchTeachers();
  }, []);

  const addTeacher = async (teacher: Omit<Teacher, "id">) => {
    setIsLoading(true);
    
    try {
      const dbTeacher = {
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialties: teacher.specialties,
        salary: teacher.salary,
        hire_date: teacher.hire_date && teacher.hire_date.trim() !== '' ? teacher.hire_date : null,
        status: teacher.status,
        notes: teacher.notes
      };
      
      const { data, error } = await supabase
        .from('teachers')
        .insert(dbTeacher)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newTeacher: Teacher = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email || '',
          phone: data[0].phone || '',
          specialties: data[0].specialties || [],
          salary: data[0].salary || 0,
          hire_date: data[0].hire_date || '',
          status: data[0].status as "active" | "inactive",
          notes: data[0].notes || '',
          created_at: data[0].created_at
        };
        
        setTeachers(prevTeachers => [...prevTeachers, newTeacher]);
        toast.success("Professor adicionado com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding teacher:", err);
      setError(err instanceof Error ? err : new Error('Failed to add teacher'));
      setIsLoading(false);
      toast.error("Erro ao adicionar professor");
    }
  };

  const updateTeacher = async (id: string, updatedTeacher: Partial<Teacher>) => {
    setIsLoading(true);
    
    try {
      const dbTeacher: any = {};
      
      if (updatedTeacher.name !== undefined) dbTeacher.name = updatedTeacher.name;
      if (updatedTeacher.email !== undefined) dbTeacher.email = updatedTeacher.email;
      if (updatedTeacher.phone !== undefined) dbTeacher.phone = updatedTeacher.phone;
      if (updatedTeacher.specialties !== undefined) dbTeacher.specialties = updatedTeacher.specialties;
      if (updatedTeacher.salary !== undefined) dbTeacher.salary = updatedTeacher.salary;
      if (updatedTeacher.hire_date !== undefined) {
        dbTeacher.hire_date = updatedTeacher.hire_date && updatedTeacher.hire_date.trim() !== '' ? updatedTeacher.hire_date : null;
      }
      if (updatedTeacher.status !== undefined) dbTeacher.status = updatedTeacher.status;
      if (updatedTeacher.notes !== undefined) dbTeacher.notes = updatedTeacher.notes;
      
      const { error } = await supabase
        .from('teachers')
        .update(dbTeacher)
        .eq('id', id);
      
      if (error) throw error;
      
      setTeachers(prevTeachers => 
        prevTeachers.map(teacher => 
          teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
        )
      );
      
      toast.success("Professor atualizado com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating teacher:", err);
      setError(err instanceof Error ? err : new Error('Failed to update teacher'));
      setIsLoading(false);
      toast.error("Erro ao atualizar professor");
    }
  };

  const deleteTeacher = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher.id !== id)
      );
      
      toast.success("Professor removido com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting teacher:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete teacher'));
      setIsLoading(false);
      toast.error("Erro ao remover professor");
    }
  };

  return {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    isLoading,
    error
  };
};
