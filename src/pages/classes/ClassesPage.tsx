
import React, { useState } from "react";
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

interface Class {
  id: string;
  name: string;
  modality: string;
  modalityColor: string;
  teacherId: string;
  teacherName: string;
  schedule: string;
  location: string;
  studentCount: number;
  dayOfWeek: string[];
}

const classFormSchema = z.object({
  name: z.string().min(1, "Nome da turma é obrigatório"),
  modality: z.string().min(1, "Modalidade é obrigatória"),
  teacherId: z.string().min(1, "Professor é obrigatório"),
  schedule: z.string().min(1, "Horário é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  dayOfWeek: z.string().array().min(1, "Selecione pelo menos um dia da semana"),
});

const ClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  
  // Mock modalities
  const modalities = [
    { id: "1", name: "Ballet", color: "bg-modalidades-ballet" },
    { id: "2", name: "Jazz", color: "bg-modalidades-jazz" },
    { id: "3", name: "Ginástica Artística", color: "bg-modalidades-ginastica" },
    { id: "4", name: "Ginástica Rítmica", color: "bg-modalidades-ritmica" },
    { id: "5", name: "Futsal", color: "bg-modalidades-futsal" },
  ];

  // Mock teachers
  const teachers = [
    { id: "1", name: "Maria Santos", modality: "Ballet" },
    { id: "2", name: "João Pereira", modality: "Futsal" },
    { id: "3", name: "Ana Lima", modality: "Jazz" },
    { id: "4", name: "Carlos Ferreira", modality: "Ginástica Artística" },
    { id: "5", name: "Mariana Costa", modality: "Ginástica Rítmica" },
  ];

  // Days of week
  const daysOfWeek = [
    { id: "seg", name: "Segunda-feira" },
    { id: "ter", name: "Terça-feira" },
    { id: "qua", name: "Quarta-feira" },
    { id: "qui", name: "Quinta-feira" },
    { id: "sex", name: "Sexta-feira" },
    { id: "sab", name: "Sábado" },
  ];

  const form = useForm<z.infer<typeof classFormSchema>>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      modality: "",
      teacherId: "",
      schedule: "",
      location: "",
      dayOfWeek: [],
    },
  });

  const selectedModality = form.watch("modality");
  
  // Filter teachers based on selected modality
  const filteredTeachers = selectedModality 
    ? teachers.filter(teacher => teacher.modality === selectedModality)
    : teachers;
  
  const onOpenDialog = (classItem?: Class) => {
    if (classItem) {
      setEditingClass(classItem);
      form.setValue("name", classItem.name);
      form.setValue("modality", classItem.modality);
      form.setValue("teacherId", classItem.teacherId);
      form.setValue("schedule", classItem.schedule);
      form.setValue("location", classItem.location);
      form.setValue("dayOfWeek", classItem.dayOfWeek);
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

  const onSubmit = (values: z.infer<typeof classFormSchema>) => {
    const selectedTeacher = teachers.find(t => t.id === values.teacherId);
    const modalityItem = modalities.find(m => m.name === values.modality);
    
    if (!selectedTeacher || !modalityItem) {
      toast.error("Professor ou modalidade não encontrado!");
      return;
    }
    
    if (editingClass) {
      // Update existing class
      const updatedClasses = classes.map((c) =>
        c.id === editingClass.id
          ? {
              ...c,
              name: values.name,
              modality: values.modality,
              modalityColor: modalityItem.color,
              teacherId: values.teacherId,
              teacherName: selectedTeacher.name,
              schedule: values.schedule,
              location: values.location,
              dayOfWeek: values.dayOfWeek,
            }
          : c
      );
      setClasses(updatedClasses);
      toast.success("Turma atualizada com sucesso!");
    } else {
      // Add new class
      const newClass: Class = {
        id: Date.now().toString(),
        name: values.name,
        modality: values.modality,
        modalityColor: modalityItem.color,
        teacherId: values.teacherId,
        teacherName: selectedTeacher.name,
        schedule: values.schedule,
        location: values.location,
        dayOfWeek: values.dayOfWeek,
        studentCount: 0,
      };
      setClasses([...classes, newClass]);
      toast.success("Turma cadastrada com sucesso!");
    }
    onCloseDialog();
  };

  const confirmDelete = (id: string) => {
    setClassToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const deleteClass = () => {
    if (classToDelete) {
      setClasses(classes.filter((c) => c.id !== classToDelete));
      toast.success("Turma removida com sucesso!");
      setDeleteConfirmOpen(false);
      setClassToDelete(null);
    }
  };

  const formatDaysOfWeek = (days: string[]) => {
    if (days.length <= 2) {
      return days.map(day => {
        const dayObj = daysOfWeek.find(d => d.id === day);
        return dayObj ? dayObj.name.substring(0, 3) : day;
      }).join(" e ");
    }
    
    return days.map(day => {
      const dayObj = daysOfWeek.find(d => d.id === day);
      return dayObj ? dayObj.name.substring(0, 3) : day;
    }).join(", ");
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
              <div className={`h-2 w-full ${classItem.modalityColor}`} />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{classItem.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {classItem.modality}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {classItem.studentCount} alunos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDaysOfWeek(classItem.dayOfWeek)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Professor:</span> {classItem.teacherName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Horário:</span> {classItem.schedule}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Local:</span> {classItem.location}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onOpenDialog(classItem)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => confirmDelete(classItem.id)}
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
                name="modality"
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
                          <SelectItem key={modality.id} value={modality.name}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${modality.color}`} />
                              <span>{modality.name}</span>
                            </div>
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
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!selectedModality}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedModality ? "Selecione o professor" : "Selecione uma modalidade primeiro"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
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
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dias da Semana</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {daysOfWeek.map((day) => (
                        <Badge
                          key={day.id}
                          variant={field.value.includes(day.id) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            field.value.includes(day.id) 
                              ? "bg-dance-primary hover:bg-dance-secondary" 
                              : ""
                          }`}
                          onClick={() => {
                            const updatedDays = field.value.includes(day.id)
                              ? field.value.filter((d) => d !== day.id)
                              : [...field.value, day.id];
                            field.onChange(updatedDays);
                          }}
                        >
                          {day.name.substring(0, 3)}
                        </Badge>
                      ))}
                    </div>
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
                      <Input placeholder="Ex: 14:00 - 15:30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Sala 3" {...field} />
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
            <Button variant="destructive" onClick={deleteClass}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassesPage;
