
import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const modalityFormSchema = z.object({
  name: z.string().min(1, "Nome da modalidade é obrigatório"),
  monthlyFee: z.coerce.number().min(0, "Valor deve ser positivo"),
  colorClass: z.string(),
});

interface Modality {
  id: string;
  name: string;
  monthlyFee: number;
  colorClass: string;
}

interface ModalityFormProps {
  initialData?: Modality | null;
  onSubmit: (data: z.infer<typeof modalityFormSchema>) => void;
  onCancel: () => void;
}

const colorOptions = [
  { label: "Ballet (Rosa)", value: "bg-modalidades-ballet" },
  { label: "Jazz (Roxo)", value: "bg-modalidades-jazz" },
  { label: "Ginástica (Azul)", value: "bg-modalidades-ginastica" },
  { label: "Rítmica (Verde)", value: "bg-modalidades-ritmica" },
  { label: "Futsal (Vermelho)", value: "bg-modalidades-futsal" },
  { label: "Amarelo", value: "bg-yellow-500" },
  { label: "Laranja", value: "bg-orange-500" },
  { label: "Azul Claro", value: "bg-sky-500" },
];

export const ModalityForm: React.FC<ModalityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof modalityFormSchema>>({
    resolver: zodResolver(modalityFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      monthlyFee: initialData?.monthlyFee || 0,
      colorClass: initialData?.colorClass || "bg-modalidades-ballet",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Modalidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ballet, Jazz, Futsal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Mensalidade (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0"
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
          name="colorClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor da Modalidade</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${field.value}`} />
                      <SelectValue placeholder="Selecione uma cor" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.value}`} />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
            {initialData ? "Salvar Alterações" : "Cadastrar Modalidade"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
