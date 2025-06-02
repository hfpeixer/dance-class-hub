import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useFinanceData } from "../hooks/useFinanceData";
import { DialogFooter } from "@/components/ui/dialog";

const paymentFormSchema = z.object({
  studentId: z.string().min(1, "Aluno é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  status: z.enum(["paid", "pending", "overdue"]),
  paymentDate: z.string().optional(),
  installments: z.coerce.number().min(1, "Número de parcelas deve ser pelo menos 1").optional(),
  useInstallments: z.boolean().default(false),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  payment?: any;
  onSubmit: (data: PaymentFormValues) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  payment, 
  onSubmit,
  onCancel
}) => {
  const { students } = useFinanceData();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: payment ? {
      studentId: payment.studentId,
      description: payment.description,
      value: payment.value,
      dueDate: payment.dueDate,
      status: payment.status,
      paymentDate: payment.paymentDate || "",
      installments: payment.installments || 1,
      useInstallments: payment.installments ? payment.installments > 1 : false,
    } : {
      studentId: "",
      description: "",
      value: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: "pending",
      paymentDate: "",
      installments: 1,
      useInstallments: false,
    },
  });

  const useInstallments = form.watch("useInstallments");
  const status = form.watch("status");

  const handleSubmit = (values: PaymentFormValues) => {
    // Se não estiver utilizando parcelas, remova o campo de parcelas
    if (!values.useInstallments) {
      delete values.installments;
    }
    
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students && students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.modality}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mensalidade Julho/2023" {...field} />
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
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="useInstallments"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Utilizar parcelas</FormLabel>
                <FormDescription>
                  Divide o valor em múltiplas parcelas mensais
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {useInstallments && (
          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Parcelas</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="2"
                    max="36"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {form.watch("installments") && form.watch("value")
                    ? `Valor por parcela: R$ ${(form.watch("value") / form.watch("installments")).toFixed(2)}`
                    : ""}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {status === "paid" && (
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Pagamento</FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field}
                    value={field.value || new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
            {payment ? "Salvar Alterações" : "Cadastrar Mensalidade"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
