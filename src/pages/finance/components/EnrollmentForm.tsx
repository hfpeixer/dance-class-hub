
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define enrollment schema with zod
const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Aluno é obrigatório"),
  modalityId: z.string().min(1, "Modalidade é obrigatória"),
  classId: z.string().min(1, "Turma é obrigatória"),
  enrollmentFee: z.coerce.number().positive("O valor deve ser maior que zero"),
  enrollmentDate: z.string().min(1, "Data de matrícula é obrigatória"),
  paymentDay: z.coerce.number().int().min(1).max(31, "Dia deve ser entre 1 e 31").default(5),
  notes: z.string().optional(),
});

type EnrollmentFormProps = {
  enrollment: any | null;
  onSubmit: (data: z.infer<typeof enrollmentSchema>) => void;
  onCancel: () => void;
};

export const EnrollmentForm = ({ enrollment, onSubmit, onCancel }: EnrollmentFormProps) => {
  const [students, setStudents] = useState<any[]>([]);
  const [modalities, setModalities] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [selectedModality, setSelectedModality] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<z.infer<typeof enrollmentSchema>>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: enrollment ? {
      studentId: enrollment.student_id || enrollment.studentId || "",
      modalityId: enrollment.modality_id || enrollment.modality || "",
      classId: enrollment.class_id || enrollment.class || "",
      enrollmentFee: enrollment.enrollment_fee || enrollment.enrollmentFee || 0,
      enrollmentDate: enrollment.enrollment_date || enrollment.enrollmentDate || new Date().toISOString().split("T")[0],
      paymentDay: enrollment.payment_day || enrollment.paymentDay || 5,
      notes: enrollment.notes || "",
    } : {
      studentId: "",
      modalityId: "",
      classId: "",
      enrollmentFee: 0,
      enrollmentDate: new Date().toISOString().split("T")[0],
      paymentDay: 5,
      notes: "",
    },
  });

  const modalityId = form.watch('modalityId');

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('id, name')
          .eq('status', 'active')
          .order('name');

        if (studentsError) throw studentsError;

        // Fetch modalities
        const { data: modalitiesData, error: modalitiesError } = await supabase
          .from('modalities')
          .select('*')
          .order('name');

        if (modalitiesError) throw modalitiesError;

        // Fetch classes
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .order('name');

        if (classesError) throw classesError;

        setStudents(studentsData || []);
        setModalities(modalitiesData || []);
        setClasses(classesData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter classes when modality is selected
  useEffect(() => {
    if (modalityId) {
      const filteredClasses = classes.filter(cls => cls.modality_id === modalityId);
      setAvailableClasses(filteredClasses);
      
      const modality = modalities.find(m => m.id === modalityId);
      setSelectedModality(modality || null);
      
      if (modality) {
        form.setValue('enrollmentFee', modality.enrollment_fee);
      }
      
      // Clear selected class if not available in new modality
      const currentClassId = form.getValues('classId');
      const isCurrentClassAvailable = filteredClasses.some(cls => cls.id === currentClassId);
      
      if (!isCurrentClassAvailable) {
        form.setValue('classId', '');
      }
    } else {
      setAvailableClasses([]);
      setSelectedModality(null);
    }
  }, [modalityId, classes, modalities, form]);

  const handleSubmit = (data: z.infer<typeof enrollmentSchema>) => {
    const formattedData = {
      studentId: data.studentId,
      modality: data.modalityId,
      class: data.classId,
      enrollmentDate: data.enrollmentDate,
      enrollmentFee: data.enrollmentFee,
      monthlyFee: selectedModality?.monthly_fee || 0,
      paymentDay: data.paymentDay,
      notes: data.notes,
      status: 'active' as const
    };
    
    onSubmit(formattedData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="modalityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modalities.map((modality) => (
                      <SelectItem key={modality.id} value={modality.id}>
                        {modality.name} - R$ {modality.monthly_fee}/mês
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turma *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!modalityId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !modalityId 
                          ? "Selecione a modalidade primeiro" 
                          : availableClasses.length === 0
                            ? "Nenhuma turma disponível"
                            : "Selecione a turma"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="enrollmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Matrícula *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enrollmentFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Matrícula *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    placeholder="Taxa de matrícula" 
                    {...field}
                  />
                </FormControl>
                {selectedModality && (
                  <FormDescription>
                    Mensalidade: R$ {selectedModality.monthly_fee}/mês
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de Vencimento *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="31"
                    step="1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Dia do mês para vencimento da mensalidade
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Observações sobre a matrícula"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
            {enrollment ? "Atualizar Matrícula" : "Registrar Matrícula"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
