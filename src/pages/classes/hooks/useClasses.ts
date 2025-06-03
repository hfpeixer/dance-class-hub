
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Class {
  id: string;
  name: string;
  modality_id: string;
  modality?: {
    id: string;
    name: string;
  };
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
            modality:modalities (
              id,
              name
            )
          `);
        
        if (error) throw error;
        
        if (data) {
          // Format the data to include modality information
          const formattedClasses = data.map((classItem: any) => ({
            id: classItem.id,
            name: classItem.name,
            modality_id: classItem.modality_id,
            modality: classItem.modality ? {
              id: classItem.modality.id,
              name: classItem.modality.name
            } : undefined,
            teacher: classItem.teacher,
            schedule: classItem.schedule,
            max_students: classItem.max_students,
            current_students: classItem.current_students,
            created_at: classItem.created_at
          }));
          
          setClasses(formattedClasses);
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
          modality:modalities (
            id,
            name
          )
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedClass = {
          id: data[0].id,
          name: data[0].name,
          modality_id: data[0].modality_id,
          modality: data[0].modality ? {
            id: data[0].modality.id,
            name: data[0].modality.name
          } : undefined,
          teacher: data[0].teacher,
          schedule: data[0].schedule,
          max_students: data[0].max_students,
          current_students: data[0].current_students,
          created_at: data[0].created_at
        };
        
        setClasses(prevClasses => [...prevClasses, formattedClass]);
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
      const { data, error } = await supabase
        .from('classes')
        .update({
          name: updatedClass.name,
          modality_id: updatedClass.modality_id,
          teacher: updatedClass.teacher,
          schedule: updatedClass.schedule,
          max_students: updatedClass.max_students,
          current_students: updatedClass.current_students
        })
        .eq('id', id)
        .select(`
          *,
          modality:modalities (
            id,
            name
          )
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedClass = {
          id: data[0].id,
          name: data[0].name,
          modality_id: data[0].modality_id,
          modality: data[0].modality ? {
            id: data[0].modality.id,
            name: data[0].modality.name
          } : undefined,
          teacher: data[0].teacher,
          schedule: data[0].schedule,
          max_students: data[0].max_students,
          current_students: data[0].current_students,
          created_at: data[0].created_at
        };
        
        setClasses(prevClasses => 
          prevClasses.map(classItem => 
            classItem.id === id ? formattedClass : classItem
          )
        );
      }
      
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
