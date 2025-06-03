
import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Edit, Trash2, Users, Calendar } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClasses, Class } from "./hooks/useClasses";
import { useTeachers } from "../teachers/hooks/useTeachers";
import { supabase } from "@/integrations/supabase/client";

interface Modality {
  id: string;
  name: string;
}

const classFormSchema = z.object({
  name: z.string().min(1, "Nome da turma é obrigatório"),
  modality_id: z.string().min(1, "Modalidade é obrigatória"),
  teacher: z.string().optional(),
  schedule: z.string().min(1, "Horário é obrigatório"),
  max_students: z.coerce.number().min(1, "Número máximo de alunos é obrigatório"),
});

const ClassesPage = () => {
  const { classes, addClass, updateClass, deleteClass, isLoading } = useClasses();
  const { teachers } = useTeachers();
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  // Fetch modalities from Supabase
  useEffect(() => {
    const fetchModalities = async () => {
      try {
        const { data, error } = await supabase
          .from('modalities')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        
        setModalities(data || []);
      } catch (err) {
        console.error("Error fetching modalities:", err);
        toast.error("Erro ao carregar modalidades");
      }
    };
    
    fetchModalities();
  }, []);

  const form = useForm<z.infer<typeof classFormSchema>>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      modality_id: "",
      teacher: "",
      schedule: "",
      max_students: 15,
    },
  });

  const onOpenDialog = (classItem?: Class) => {
    if (classItem) {
      setEditingClass(classItem);
      form.setValue("name", classItem.name);
      form.setValue("modality_id", classItem.modality_id);
      form.setValue("teacher", classItem.teacher || "");
      form.setValue("schedule", classItem.schedule);
      form.setValue("max_students", classItem.max_students || 15);
    } else {
      setEditingClass(null);
      form.reset();
    }
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof classFormSchema>) => {
    try {
      if (editingClass) {
        await updateClass(editingClass.id, {
          name: values.name,
          modality_id: values.modality_id,
          teacher: values.teacher,
          schedule: values.schedule,
          max_students: values.max_students,
        });
      } else {
        await addClass({
          name: values.name,
          modality_id: values.modality_id,
          teacher: values.teacher,
          schedule: values.schedule,
          max_students: values.max_students,
          current_students: 0,
        });
      }
      onCloseDialog();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  const confirmDelete = (id: string) => {
    setClassToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (classToDelete) {
      await deleteClass(classToDelete);
      setDeleteConfirmOpen(false);
      setClassToDelete(null);
    }
  };

  const getModalityName = (modalityId: string) => {
    const modality = modalities.find(m => m.id === modalityId);
    return modality?.name || 'Modalidade não encontrada';
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Turmas"
        subtitle="Gerencie as turmas do sistema"
        icon={BookOpen}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => onOpenDialog()}
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Turma
        </Button>
      </PageTitle>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhuma turma cadastrada</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre sua primeira turma para começar.
              </p>
              <Button 
                className="bg-dance-primary hover:bg-dance-secondary"
                onClick={() => onOpenDialog()}
                disabled={isLoading}
              >
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Turma
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{classItem.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {classItem.modality?.name || getModalityName(classItem.modality_id)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {classItem.current_students || 0}/{classItem.max_students || 0} alunos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {classItem.schedule}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {classItem.teacher && (
                    <p className="text-sm">
                      <span className="font-medium">Professor:</span> {classItem.teacher}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Horário:</span> {classItem.schedule}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onOpenDialog(classItem)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => confirmDelete(classItem.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remover
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Class Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Editar Turma" : "Nova Turma"}
            </DialogTitle>
            <DialogDescription>
              {editingClass
                ? "Edite as informações da turma."
                : "Preencha as informações para cadastrar uma nova turma."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Turma</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ballet Infantil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modality_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modalities.map((modality) => (
                          <SelectItem key={modality.id} value={modality.id}>
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
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o professor (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Sem professor atribuído</SelectItem>
                        {teachers.filter(t => t.status === 'active').map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.name}>
                            {teacher.name}
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
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Segunda e Quarta 14:00-15:30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_students"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Alunos</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="15"
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
                <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary" disabled={isLoading}>
                  {editingClass ? "Salvar Alterações" : "Cadastrar Turma"}
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
              Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassesPage;
