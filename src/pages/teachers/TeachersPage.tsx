
import React, { useState } from "react";
import { UserCheck, Plus, Edit, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Teacher {
  id: string;
  name: string;
  modality: string;
  commissionType: "fixed" | "percentage";
  commissionValue: number;
  salary: number;
}

const teacherFormSchema = z.object({
  name: z.string().min(1, "Nome do professor é obrigatório"),
  modality: z.string().min(1, "Modalidade é obrigatória"),
  commissionType: z.enum(["fixed", "percentage"]),
  commissionValue: z.coerce.number().min(0),
  salary: z.coerce.number().min(0),
});

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);

  // Mock modalities
  const modalities = [
    { id: "1", name: "Ballet" },
    { id: "2", name: "Jazz" },
    { id: "3", name: "Ginástica Artística" },
    { id: "4", name: "Ginástica Rítmica" },
    { id: "5", name: "Futsal" },
  ];

  const form = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      modality: "",
      commissionType: "fixed",
      commissionValue: 0,
      salary: 0,
    },
  });

  const onOpenDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      form.setValue("name", teacher.name);
      form.setValue("modality", teacher.modality);
      form.setValue("commissionType", teacher.commissionType);
      form.setValue("commissionValue", teacher.commissionValue);
      form.setValue("salary", teacher.salary);
    } else {
      setEditingTeacher(null);
      form.reset();
    }
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof teacherFormSchema>) => {
    if (editingTeacher) {
      // Update existing teacher
      const updatedTeachers = teachers.map((t) =>
        t.id === editingTeacher.id
          ? {
              ...t,
              name: values.name,
              modality: values.modality,
              commissionType: values.commissionType,
              commissionValue: values.commissionValue,
              salary: values.salary,
            }
          : t
      );
      setTeachers(updatedTeachers);
      toast.success("Professor atualizado com sucesso!");
    } else {
      // Add new teacher
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name: values.name,
        modality: values.modality,
        commissionType: values.commissionType,
        commissionValue: values.commissionValue,
        salary: values.salary,
      };
      setTeachers([...teachers, newTeacher]);
      toast.success("Professor cadastrado com sucesso!");
    }
    onCloseDialog();
  };

  const confirmDelete = (id: string) => {
    setTeacherToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const deleteTeacher = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete));
      toast.success("Professor removido com sucesso!");
      setDeleteConfirmOpen(false);
      setTeacherToDelete(null);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Professores"
        subtitle="Gerencie os professores do sistema"
        icon={UserCheck}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => onOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Professor
        </Button>
      </PageTitle>

      {teachers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <UserCheck className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum professor cadastrado</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre seu primeiro professor para começar.
              </p>
              <Button 
                className="bg-dance-primary hover:bg-dance-secondary"
                onClick={() => onOpenDialog()}
              >
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Professor
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-dance-primary">
                    <AvatarFallback className="bg-dance-primary/10 text-dance-primary font-medium">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{teacher.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {teacher.modality}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Salário Fixo</p>
                    <p className="font-medium">R$ {teacher.salary.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comissão</p>
                    <p className="font-medium">
                      {teacher.commissionType === "fixed" 
                        ? `R$ ${teacher.commissionValue.toFixed(2)}/aluno`
                        : `${teacher.commissionValue}%`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex mt-4 space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onOpenDialog(teacher)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => confirmDelete(teacher.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Teacher Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? "Editar Professor" : "Novo Professor"}
            </DialogTitle>
            <DialogDescription>
              {editingTeacher
                ? "Edite as informações do professor."
                : "Preencha as informações para cadastrar um novo professor."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do professor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade</FormLabel>
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
                          <SelectItem key={modality.id} value={modality.name}>
                            {modality.name}
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
                name="commissionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Comissão</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de comissão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed">Valor Fixo por Aluno</SelectItem>
                        <SelectItem value="percentage">Porcentagem</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("commissionType") === "fixed" 
                        ? "Valor por Aluno (R$)" 
                        : "Porcentagem (%)"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step={form.watch("commissionType") === "fixed" ? "0.01" : "1"}
                        min="0"
                        placeholder={form.watch("commissionType") === "fixed" ? "0.00" : "0"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário Fixo (R$)</FormLabel>
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
                  {editingTeacher ? "Salvar Alterações" : "Cadastrar Professor"}
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
              Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteTeacher}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPage;
