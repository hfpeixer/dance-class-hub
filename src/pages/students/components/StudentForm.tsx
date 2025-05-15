import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
  modalities: z.array(z.string()).min(1, "Selecione pelo menos uma modalidade"),
  class: z.string().min(1, "Turma é obrigatória"),
  status: z.enum(["active", "inactive"]).default("active"),
  address: z.string().optional(),
  cityState: z.string().optional(),
  zipCode: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentCPF: z.string().optional(),
  enrollmentDate: z.string().optional(),
  notes: z.string().optional(),
});

type StudentFormProps = {
  initialData?: Student | null;
  onSubmit: (data: z.infer<typeof studentSchema>) => void;
  onCancel: () => void;
};

// Mock data for selects
const modalities = ["Ballet", "Jazz", "Ginástica", "Futsal", "Hip Hop"];
const classesByModality = {
  "Ballet": [
    "Ballet Infantil - Segunda e Quarta",
    "Ballet Infantil - Terça e Quinta",
    "Ballet Juvenil - Segunda e Sexta",
    "Ballet Adulto - Sábados"
  ],
  "Jazz": [
    "Jazz Kids - Quarta e Sexta", 
    "Jazz Teen - Terça e Quinta", 
    "Jazz Adulto - Sábados"
  ],
  "Ginástica": [
    "Ginástica Artística - Terça e Quinta", 
    "Ginástica Rítmica - Segunda e Quarta"
  ],
  "Futsal": [
    "Futsal Juvenil - Segunda e Quarta", 
    "Futsal Infantil - Terça e Quinta"
  ],
  "Hip Hop": [
    "Hip Hop Teen - Sexta e Sábado", 
    "Hip Hop Adulto - Terça e Quinta"
  ]
};

export const StudentForm = ({ initialData, onSubmit, onCancel }: StudentFormProps) => {
  const [selectedModality, setSelectedModality] = useState<string | null>(
    initialData?.modality || null
  );
  
  // Initialize available classes based on initial modality
  const [availableClasses, setAvailableClasses] = useState<string[]>(
    initialData?.modality ? classesByModality[initialData.modality as keyof typeof classesByModality] || [] : []
  );

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData ? {
      ...initialData,
      modalities: [initialData.modality], // Convert single modality to array
    } : {
      name: "",
      email: "",
      phone: "",
      age: 0,
      birthday: "",
      modalities: [],
      class: "",
      status: "active",
      address: "",
      cityState: "",
      zipCode: "",
      parentName: "",
      parentPhone: "",
      parentCPF: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  // Update available classes when modality changes
  const handleModalityChange = (modality: string) => {
    setSelectedModality(modality);
    if (modality in classesByModality) {
      setAvailableClasses(classesByModality[modality as keyof typeof classesByModality]);
      // Reset class field when modality changes
      form.setValue("class", "");
    } else {
      setAvailableClasses([]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="enrollmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de matrícula</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações da Matrícula</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="modalities"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Modalidades *</FormLabel>
                    </div>
                    {modalities.map((modality) => (
                      <FormField
                        key={modality}
                        control={form.control}
                        name="modalities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={modality}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(modality)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, modality]
                                      : field.value.filter((value) => value !== modality);
                                    field.onChange(newValue);
                                    
                                    // When first modality is selected or changed, update available classes
                                    if (checked && (!selectedModality || newValue.length === 1)) {
                                      handleModalityChange(modality);
                                    } else if (!checked && field.value.length === 1) {
                                      setSelectedModality(null);
                                      setAvailableClasses([]);
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {modality}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedModality && availableClasses.length > 0 ? (
                        availableClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-selection" disabled>
                          Selecione uma modalidade primeiro
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
