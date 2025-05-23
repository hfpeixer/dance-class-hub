import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "../hooks/useStudents";

// Define the form schema with zod
const studentSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  age: z.coerce.number().min(1, "A idade deve ser maior que 0"),
  birthday: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  address: z.string().optional(),
  cityState: z.string().optional(),
  zipCode: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentCPF: z.string().optional(),
  notes: z.string().optional(),
});

type StudentFormProps = {
  initialData?: Student | null;
  onSubmit: (data: z.infer<typeof studentSchema>) => void;
  onCancel: () => void;
};

export const StudentForm = ({ initialData, onSubmit, onCancel }: StudentFormProps) => {
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData ? {
      ...initialData,
    } : {
      name: "",
      email: "",
      phone: "",
      age: 0,
      birthday: "",
      status: "active",
      address: "",
      cityState: "",
      zipCode: "",
      parentName: "",
      parentPhone: "",
      parentCPF: "",
      notes: "",
    },
  });

  // Handle the form submission
  const handleFormSubmit = (data: z.infer<typeof studentSchema>) => {
    console.log("Form data submitted:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do aluno" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email do aluno" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone do aluno" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade *</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="Idade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cityState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade/Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade, UF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="CEP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Responsável</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone do responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parentCPF"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="CPF do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Observações sobre o aluno" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
            {initialData ? "Salvar Alterações" : "Cadastrar Aluno"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
