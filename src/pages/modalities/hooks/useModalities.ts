
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Modality {
  id: string;
  name: string;
  description?: string;
  monthly_fee: number;
  enrollment_fee: number;
  created_at: string;
  students?: number;
  classes?: number;
  colorClass?: string;
}

export const useModalities = () => {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const colors = [
    'bg-modalidades-ballet',
    'bg-modalidades-jazz', 
    'bg-modalidades-ginastica',
    'bg-modalidades-ritmica',
    'bg-modalidades-futsal',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100'
  ];

  const fetchModalities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('modalities')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch student counts for each modality
      const modalitiesWithStats = await Promise.all(
        (data || []).map(async (modality, index) => {
          // Get student count
          const { data: enrollments, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('id')
            .eq('modality_id', modality.id)
            .eq('status', 'active');

          if (enrollmentError) {
            console.error('Error fetching enrollment count:', enrollmentError);
          }

          // Get class count
          const { data: classes, error: classError } = await supabase
            .from('classes')
            .select('id')
            .eq('modality_id', modality.id);

          if (classError) {
            console.error('Error fetching class count:', classError);
          }

          return {
            ...modality,
            students: enrollments?.length || 0,
            classes: classes?.length || 0,
            colorClass: colors[index % colors.length]
          };
        })
      );

      setModalities(modalitiesWithStats);
    } catch (err) {
      console.error('Error fetching modalities:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch modalities'));
      toast.error('Erro ao carregar modalidades');
    } finally {
      setIsLoading(false);
    }
  };

  const addModality = async (modalityData: Omit<Modality, 'id' | 'created_at' | 'students' | 'classes' | 'colorClass'>) => {
    try {
      const { data, error } = await supabase
        .from('modalities')
        .insert(modalityData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Modalidade criada com sucesso!');
      await fetchModalities(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating modality:', error);
      toast.error('Erro ao criar modalidade');
      throw error;
    }
  };

  const updateModality = async (id: string, modalityData: Partial<Modality>) => {
    try {
      const { data, error } = await supabase
        .from('modalities')
        .update(modalityData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Modalidade atualizada com sucesso!');
      await fetchModalities(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error updating modality:', error);
      toast.error('Erro ao atualizar modalidade');
      throw error;
    }
  };

  const deleteModality = async (id: string) => {
    try {
      // Check if modality has any active enrollments
      const { data: enrollments, error: checkEnrollmentsError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('modality_id', id)
        .eq('status', 'active')
        .limit(1);

      if (checkEnrollmentsError) throw checkEnrollmentsError;

      if (enrollments && enrollments.length > 0) {
        toast.error('Não é possível excluir uma modalidade que possui matrículas ativas. Cancele as matrículas primeiro.');
        return;
      }

      // Check if modality has any classes
      const { data: classes, error: checkClassesError } = await supabase
        .from('classes')
        .select('id')
        .eq('modality_id', id)
        .limit(1);

      if (checkClassesError) throw checkClassesError;

      if (classes && classes.length > 0) {
        toast.error('Não é possível excluir uma modalidade que possui turmas. Remova as turmas primeiro.');
        return;
      }

      // Delete cancelled/inactive enrollments first if any
      const { error: deleteEnrollmentsError } = await supabase
        .from('enrollments')
        .delete()
        .eq('modality_id', id)
        .in('status', ['cancelled', 'inactive']);

      if (deleteEnrollmentsError) {
        console.error('Error deleting related enrollments:', deleteEnrollmentsError);
        // Continue with deletion even if this fails
      }

      // Now delete the modality
      const { error } = await supabase
        .from('modalities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Modalidade removida com sucesso!');
      await fetchModalities(); // Refresh the list
    } catch (error) {
      console.error('Error deleting modality:', error);
      toast.error('Erro ao remover modalidade. Verifique se não há dados relacionados.');
      throw error;
    }
  };

  useEffect(() => {
    fetchModalities();
  }, []);

  return {
    modalities,
    isLoading,
    error,
    addModality,
    updateModality,
    deleteModality,
    refetch: fetchModalities
  };
};
