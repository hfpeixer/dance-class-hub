
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
import { 
  Enrollment, 
  STUDENTS, 
  MODALITIES, 
  CLASSES, 
  PAYMENT_METHODS 
} from "../hooks/useFinanceData";

// Define enrollment schema with zod
const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Aluno é obrigatório"),
  modalityId: z.string().min(1, "Modalidade é obrigatória"),
  classId: z.string().min(1, "Turma é obrigatória"),
  value: z.coerce.number().positive("O valor deve ser maior que zero"),
  date: z.string().min(1, "Data de matrícula é obrigatória"),
  installments: z.coerce.number().int().min(1, "Mínimo de 1 parcela").default(1),
  paymentMethod: z.string().optional(),
});

type EnrollmentFormProps = {
  enrollment: Enrollment | null;
  onSubmit: (data: z.infer<typeof enrollmentSchema>) => void;
  onCancel: () => void;
};

export const EnrollmentForm = ({ enrollment, onSubmit, onCancel }: EnrollmentFormProps) => {
  const [availableClasses, setAvailableClasses] = useState<typeof CLASSES>([]);
  const [selectedModality, setSelectedModality] = useState<typeof MODALITIES[0] | null>(null);
  
  const form = useForm<z.infer<typeof enrollmentSchema>>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: enrollment || {
      studentId: "",
      modalityId: "",
      classId: "",
      value: 0,
      date: new Date().toISOString().split("T")[0],
      installments: 1,
    },
  });

  const modalityId = form.watch('modalityId');
  const installments = form.watch('installments');

  // Filtrar turmas quando a modalidade é selecionada
  useEffect(() => {
    if (modalityId) {
      const filteredClasses = CLASSES.filter(cls => cls.modalityId === modalityId);
      setAvailableClasses(filteredClasses);
      
      const modality = MODALITIES.find(m => m.id === modalityId);
      setSelectedModality(modality || null);
      
      if (modality) {
        form.setValue('value', modality.monthlyFee);
      }
      
      // Limpar turma selecionada se não estiver disponível na nova modalidade
      const currentClassId = form.getValues('classId');
      const isCurrentClassAvailable = filteredClasses.some(cls => cls.id === currentClassId);
      
      if (!isCurrentClassAvailable) {
        form.setValue('classId', '');
      }
    } else {
      setAvailableClasses([]);
      setSelectedModality(null);
    }
  }, [modalityId, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  {STUDENTS.map((student) => (
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
                    {MODALITIES.map((modality) => (
                      <SelectItem key={modality.id} value={modality.id}>
                        {modality.name} - R$ {modality.monthlyFee}/mês
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
            name="date"
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
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Matrícula *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    placeholder="Valor da matrícula" 
                    {...field}
                  />
                </FormControl>
                {selectedModality && (
                  <FormDescription>
                    Mensalidade: R$ {selectedModality.monthlyFee}/mês
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
            name="installments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcelas *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    step="1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {installments > 1 ? (
                    <>A matrícula e {installments - 1} mensalidades</>
                  ) : (
                    <>Matrícula + primeira mensalidade</>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de Pagamento (Matrícula)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Deixe em branco para pagar depois
                </FormDescription>
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
