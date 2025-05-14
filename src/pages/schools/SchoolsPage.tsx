
import React, { useState } from "react";
import { School, Plus, Edit, Trash2 } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define School interface
interface School {
  id: string;
  name: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
  };
}

const schoolFormSchema = z.object({
  name: z.string().min(1, "Nome da escola é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
});

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
    },
  });

  const onOpenDialog = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      form.setValue("name", school.name);
      form.setValue("street", school.address.street);
      form.setValue("number", school.address.number);
      form.setValue("neighborhood", school.address.neighborhood);
      form.setValue("city", school.address.city);
    } else {
      setEditingSchool(null);
      form.reset();
    }
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof schoolFormSchema>) => {
    if (editingSchool) {
      // Update existing school
      const updatedSchools = schools.map((s) =>
        s.id === editingSchool.id
          ? {
              ...s,
              name: values.name,
              address: {
                street: values.street,
                number: values.number,
                neighborhood: values.neighborhood,
                city: values.city,
              },
            }
          : s
      );
      setSchools(updatedSchools);
      toast.success("Escola atualizada com sucesso!");
    } else {
      // Add new school
      const newSchool: School = {
        id: Date.now().toString(),
        name: values.name,
        address: {
          street: values.street,
          number: values.number,
          neighborhood: values.neighborhood,
          city: values.city,
        },
      };
      setSchools([...schools, newSchool]);
      toast.success("Escola cadastrada com sucesso!");
    }
    onCloseDialog();
  };

  const confirmDelete = (id: string) => {
    setSchoolToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const deleteSchool = () => {
    if (schoolToDelete) {
      setSchools(schools.filter((s) => s.id !== schoolToDelete));
      toast.success("Escola removida com sucesso!");
      setDeleteConfirmOpen(false);
      setSchoolToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Escolas"
        subtitle="Gerencie as unidades e escolas do sistema"
        icon={School}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => onOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Escola
        </Button>
      </PageTitle>

      {schools.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <School className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhuma escola cadastrada</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre sua primeira escola ou unidade para começar.
              </p>
              <Button 
                className="bg-dance-primary hover:bg-dance-secondary"
                onClick={() => onOpenDialog()}
              >
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Escola
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {schools.map((school) => (
            <Card key={school.id} className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{school.address.street}, {school.address.number}</p>
                  <p>{school.address.neighborhood}, {school.address.city}</p>
                </div>
                <div className="flex mt-4 space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onOpenDialog(school)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => confirmDelete(school.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* School Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSchool ? "Editar Escola" : "Nova Escola"}
            </DialogTitle>
            <DialogDescription>
              {editingSchool
                ? "Edite as informações da escola."
                : "Preencha as informações para cadastrar uma nova escola."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Escola</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da escola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
                  {editingSchool ? "Salvar Alterações" : "Cadastrar Escola"}
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
              Tem certeza que deseja excluir esta escola? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteSchool}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolsPage;
