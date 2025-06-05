
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const modalityFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  monthly_fee: z.number().min(0, "Mensalidade deve ser um valor positivo"),
  enrollment_fee: z.number().min(0, "Taxa de matrícula deve ser um valor positivo"),
});

type ModalityFormValues = z.infer<typeof modalityFormSchema>;

interface ModalityFormProps {
  initialData?: any;
  onSubmit: (data: ModalityFormValues) => void;
  onCancel: () => void;
}

export const ModalityForm: React.FC<ModalityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<ModalityFormValues>({
    resolver: zodResolver(modalityFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      monthly_fee: initialData?.monthly_fee || 0,
      enrollment_fee: initialData?.enrollment_fee || 0,
    },
  });

  const handleSubmit = (data: ModalityFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Modalidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ballet Clássico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição da modalidade"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthly_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensalidade (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enrollment_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa de Matrícula (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
            {initialData ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
