
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Modality {
  id: string;
  name: string;
  description?: string;
  monthly_fee: number;
  enrollment_fee: number;
  created_at?: string;
}

export const useModalities = () => {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchModalities = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('modalities')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setModalities(data);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching modalities:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch modalities'));
        setIsLoading(false);
        toast.error("Erro ao carregar modalidades");
      }
    };
    
    fetchModalities();
  }, []);

  const addModality = async (modality: Omit<Modality, "id">) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('modalities')
        .insert({
          name: modality.name,
          description: modality.description,
          monthly_fee: modality.monthly_fee,
          enrollment_fee: modality.enrollment_fee
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setModalities(prevModalities => [...prevModalities, data[0]]);
        toast.success("Modalidade adicionada com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding modality:", err);
      setError(err instanceof Error ? err : new Error('Failed to add modality'));
      setIsLoading(false);
      toast.error("Erro ao adicionar modalidade");
    }
  };

  const updateModality = async (id: string, updatedModality: Partial<Modality>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('modalities')
        .update(updatedModality)
        .eq('id', id);
      
      if (error) throw error;
      
      setModalities(prevModalities => 
        prevModalities.map(modality => 
          modality.id === id ? { ...modality, ...updatedModality } : modality
        )
      );
      
      toast.success("Modalidade atualizada com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating modality:", err);
      setError(err instanceof Error ? err : new Error('Failed to update modality'));
      setIsLoading(false);
      toast.error("Erro ao atualizar modalidade");
    }
  };

  const deleteModality = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('modalities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setModalities(prevModalities => 
        prevModalities.filter(modality => modality.id !== id)
      );
      
      toast.success("Modalidade removida com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting modality:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete modality'));
      setIsLoading(false);
      toast.error("Erro ao remover modalidade");
    }
  };

  return {
    modalities,
    addModality,
    updateModality,
    deleteModality,
    isLoading,
    error
  };
};
