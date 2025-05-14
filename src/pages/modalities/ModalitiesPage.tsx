
import React, { useState } from "react";
import { Music2, Plus, Edit, Trash2 } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";

interface Modality {
  id: string;
  name: string;
  monthlyFee: number;
  students: number;
  classes: number;
  colorClass: string;
}

const modalityFormSchema = z.object({
  name: z.string().min(1, "Nome da modalidade é obrigatório"),
  monthlyFee: z.coerce.number().min(0, "Valor deve ser positivo"),
  colorClass: z.string(),
});

const ModalitiesPage = () => {
  // Mock modalities data - we're using this as initial state now
  const [modalities, setModalities] = useState<Modality[]>([
    {
      id: "1",
      name: "Ballet",
      monthlyFee: 150,
      students: 45,
      classes: 4,
      colorClass: "bg-modalidades-ballet",
    },
    {
      id: "2",
      name: "Jazz",
      monthlyFee: 140,
      students: 30,
      classes: 3,
      colorClass: "bg-modalidades-jazz",
    },
    {
      id: "3",
      name: "Ginástica Artística",
      monthlyFee: 160,
      students: 25,
      classes: 3,
      colorClass: "bg-modalidades-ginastica",
    },
    {
      id: "4",
      name: "Ginástica Rítmica",
      monthlyFee: 160,
      students: 20,
      classes: 2,
      colorClass: "bg-modalidades-ritmica",
    },
    {
      id: "5",
      name: "Futsal",
      monthlyFee: 120,
      students: 35,
      classes: 4,
      colorClass: "bg-modalidades-futsal",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingModality, setEditingModality] = useState<Modality | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [modalityToDelete, setModalityToDelete] = useState<string | null>(null);

  // Available color classes
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

  const form = useForm<z.infer<typeof modalityFormSchema>>({
    resolver: zodResolver(modalityFormSchema),
    defaultValues: {
      name: "",
      monthlyFee: 0,
      colorClass: "bg-modalidades-ballet",
    },
  });

  const onOpenDialog = (modality?: Modality) => {
    if (modality) {
      setEditingModality(modality);
      form.setValue("name", modality.name);
      form.setValue("monthlyFee", modality.monthlyFee);
      form.setValue("colorClass", modality.colorClass);
    } else {
      setEditingModality(null);
      form.reset({
        name: "",
        monthlyFee: 0,
        colorClass: "bg-modalidades-ballet",
      });
    }
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof modalityFormSchema>) => {
    if (editingModality) {
      // Update existing modality
      const updatedModalities = modalities.map((m) =>
        m.id === editingModality.id
          ? {
              ...m,
              name: values.name,
              monthlyFee: values.monthlyFee,
              colorClass: values.colorClass,
            }
          : m
      );
      setModalities(updatedModalities);
      toast.success("Modalidade atualizada com sucesso!");
    } else {
      // Add new modality - with 0 students and classes initially
      const newModality: Modality = {
        id: Date.now().toString(),
        name: values.name,
        monthlyFee: values.monthlyFee,
        students: 0,
        classes: 0,
        colorClass: values.colorClass,
      };
      setModalities([...modalities, newModality]);
      toast.success("Modalidade cadastrada com sucesso!");
    }
    onCloseDialog();
  };

  const confirmDelete = (id: string) => {
    setModalityToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const deleteModality = () => {
    if (modalityToDelete) {
      setModalities(modalities.filter((m) => m.id !== modalityToDelete));
      toast.success("Modalidade removida com sucesso!");
      setDeleteConfirmOpen(false);
      setModalityToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Modalidades"
        subtitle="Gerencie as modalidades de dança e esportes oferecidas"
        icon={Music2}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => onOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modalities.map((modality) => (
          <Card key={modality.id} className="overflow-hidden border-border">
            <div className={`h-2 w-full ${modality.colorClass}`} />
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center justify-between">
                {modality.name}
                <Badge variant="outline" className="ml-2">
                  R$ {modality.monthlyFee}/mês
                </Badge>
              </CardTitle>
              <CardDescription>
                {modality.students} alunos em {modality.classes} turmas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <p className="text-sm font-medium">Alunos</p>
                  <p className="text-2xl font-bold">{modality.students}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Turmas</p>
                  <p className="text-2xl font-bold">{modality.classes}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onOpenDialog(modality)}
              >
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => confirmDelete(modality.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remover
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modality Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingModality ? "Editar Modalidade" : "Nova Modalidade"}
            </DialogTitle>
            <DialogDescription>
              {editingModality
                ? "Edite as informações da modalidade."
                : "Preencha as informações para cadastrar uma nova modalidade."}
            </DialogDescription>
          </DialogHeader>
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
                <Button type="button" variant="outline" onClick={onCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
                  {editingModality ? "Salvar Alterações" : "Cadastrar Modalidade"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta modalidade? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteModality}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalitiesPage;
