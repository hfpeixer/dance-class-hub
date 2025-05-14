
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Product } from "../hooks/useProducts";

// Define the form schema with zod
const productSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().min(0.01, "O preço deve ser maior que zero"),
  category: z.string().min(1, "A categoria é obrigatória"),
  stock: z.coerce.number().int().min(0, "O estoque deve ser um número positivo"),
  minStock: z.coerce.number().int().min(0, "O estoque mínimo deve ser um número positivo"),
  cost: z.coerce.number().min(0, "O custo deve ser um número positivo").optional(),
  supplier: z.string().optional(),
  supplierContact: z.string().optional(),
  allowInstallments: z.boolean().default(false),
  maxInstallments: z.coerce.number().int().min(0).default(0),
  installmentFee: z.coerce.number().min(0).default(0),
});

type ProductFormProps = {
  initialData?: Product | null;
  onSubmit: (data: z.infer<typeof productSchema>) => void;
  onCancel: () => void;
};

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      sku: "",
      price: 0,
      category: "",
      stock: 0,
      minStock: 0,
      cost: 0,
      supplier: "",
      supplierContact: "",
      allowInstallments: false,
      maxInstallments: 0,
      installmentFee: 0,
    },
  });

  const watchAllowInstallments = form.watch("allowInstallments");

  const categories = [
    "Calçados", 
    "Vestuário", 
    "Acessórios", 
    "Materiais", 
    "Livros", 
    "Eletrônicos",
    "Outros"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="inventory">Inventário</TabsTrigger>
            <TabsTrigger value="payments">Pagamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU / Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Código do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Categoria do produto" 
                        list="categories"
                        {...field} 
                      />
                    </FormControl>
                    <datalist id="categories">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                    <FormDescription>
                      Selecione uma categoria existente ou digite uma nova
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$) *</FormLabel>
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
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o produto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque atual *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1"
                        placeholder="0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque mínimo *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1"
                        placeholder="0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Alerta quando o estoque ficar abaixo deste valor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo (R$)</FormLabel>
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Fornecedor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Fornecedor</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fornecedor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplierContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato do Fornecedor</FormLabel>
                      <FormControl>
                        <Input placeholder="Email ou telefone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <FormField
              control={form.control}
              name="allowInstallments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Permitir Parcelamento
                    </FormLabel>
                    <FormDescription>
                      Habilite esta opção para permitir pagamento parcelado
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchAllowInstallments && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxInstallments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número máximo de parcelas</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="2" 
                          max="12" 
                          step="1"
                          placeholder="6" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="installmentFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de juros (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0"
                          placeholder="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        0% para parcelamento sem juros
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
            {initialData ? "Salvar Alterações" : "Cadastrar Produto"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
