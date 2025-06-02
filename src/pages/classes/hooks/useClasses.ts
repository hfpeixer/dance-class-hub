
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Class {
  id: string;
  name: string;
  modality_id: string;
  teacher?: string;
  schedule: string;
  max_students?: number;
  current_students?: number;
  created_at?: string;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('classes')
          .select(`
            *,
            modalities (
              id,
              name
            )
          `);
        
        if (error) throw error;
        
        if (data) {
          setClasses(data);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch classes'));
        setIsLoading(false);
        toast.error("Erro ao carregar turmas");
      }
    };
    
    fetchClasses();
  }, []);

  const addClass = async (classData: Omit<Class, "id">) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: classData.name,
          modality_id: classData.modality_id,
          teacher: classData.teacher,
          schedule: classData.schedule,
          max_students: classData.max_students,
          current_students: classData.current_students || 0
        })
        .select(`
          *,
          modalities (
            id,
            name
          )
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setClasses(prevClasses => [...prevClasses, data[0]]);
        toast.success("Turma adicionada com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding class:", err);
      setError(err instanceof Error ? err : new Error('Failed to add class'));
      setIsLoading(false);
      toast.error("Erro ao adicionar turma");
    }
  };

  const updateClass = async (id: string, updatedClass: Partial<Class>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('classes')
        .update({
          name: updatedClass.name,
          modality_id: updatedClass.modality_id,
          teacher: updatedClass.teacher,
          schedule: updatedClass.schedule,
          max_students: updatedClass.max_students,
          current_students: updatedClass.current_students
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setClasses(prevClasses => 
        prevClasses.map(classItem => 
          classItem.id === id ? { ...classItem, ...updatedClass } : classItem
        )
      );
      
      toast.success("Turma atualizada com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating class:", err);
      setError(err instanceof Error ? err : new Error('Failed to update class'));
      setIsLoading(false);
      toast.error("Erro ao atualizar turma");
    }
  };

  const deleteClass = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setClasses(prevClasses => 
        prevClasses.filter(classItem => classItem.id !== id)
      );
      
      toast.success("Turma removida com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting class:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete class'));
      setIsLoading(false);
      toast.error("Erro ao remover turma");
    }
  };

  return {
    classes,
    addClass,
    updateClass,
    deleteClass,
    isLoading,
    error
  };
};
