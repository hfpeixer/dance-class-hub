
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface School {
  id: string;
  name: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  phone?: string;
  email?: string;
  principal?: string;
  status: "active" | "inactive";
  created_at?: string;
}

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          const formattedSchools: School[] = data.map((school: any) => ({
            id: school.id,
            name: school.name,
            address: school.address || '',
            neighborhood: school.neighborhood || '',
            city: school.city || '',
            phone: school.phone || '',
            email: school.email || '',
            principal: school.principal || '',
            status: school.status as "active" | "inactive",
            created_at: school.created_at
          }));
          
          setSchools(formattedSchools);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch schools'));
        setIsLoading(false);
        toast.error("Erro ao carregar escolas");
      }
    };
    
    fetchSchools();
  }, []);

  const addSchool = async (school: Omit<School, "id">) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert({
          name: school.name,
          address: school.address,
          neighborhood: school.neighborhood,
          city: school.city,
          phone: school.phone,
          email: school.email,
          principal: school.principal,
          status: school.status
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newSchool: School = {
          id: data[0].id,
          name: data[0].name,
          address: data[0].address || '',
          neighborhood: data[0].neighborhood || '',
          city: data[0].city || '',
          phone: data[0].phone || '',
          email: data[0].email || '',
          principal: data[0].principal || '',
          status: data[0].status as "active" | "inactive",
          created_at: data[0].created_at
        };
        
        setSchools(prevSchools => [...prevSchools, newSchool]);
        toast.success("Escola adicionada com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding school:", err);
      setError(err instanceof Error ? err : new Error('Failed to add school'));
      setIsLoading(false);
      toast.error("Erro ao adicionar escola");
    }
  };

  const updateSchool = async (id: string, updatedSchool: Partial<School>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('schools')
        .update({
          name: updatedSchool.name,
          address: updatedSchool.address,
          neighborhood: updatedSchool.neighborhood,
          city: updatedSchool.city,
          phone: updatedSchool.phone,
          email: updatedSchool.email,
          principal: updatedSchool.principal,
          status: updatedSchool.status
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setSchools(prevSchools => 
        prevSchools.map(school => 
          school.id === id ? { ...school, ...updatedSchool } : school
        )
      );
      
      toast.success("Escola atualizada com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating school:", err);
      setError(err instanceof Error ? err : new Error('Failed to update school'));
      setIsLoading(false);
      toast.error("Erro ao atualizar escola");
    }
  };

  const deleteSchool = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSchools(prevSchools => 
        prevSchools.filter(school => school.id !== id)
      );
      
      toast.success("Escola removida com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting school:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete school'));
      setIsLoading(false);
      toast.error("Erro ao remover escola");
    }
  };

  return {
    schools,
    addSchool,
    updateSchool,
    deleteSchool,
    isLoading,
    error
  };
};
