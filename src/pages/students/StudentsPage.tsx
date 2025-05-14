
import React, { useState } from "react";
import { Users, Plus, Search, FileText, Download, Calendar } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { StudentForm } from "./components/StudentForm";
import { StudentDetails } from "./components/StudentDetails";
import { toast } from "sonner";
import { useStudents } from "./hooks/useStudents";

const StudentsPage = () => {
  // Use custom hook for student data management
  const { 
    students, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    toggleStudentStatus,
    isLoading,
    filteredStudents,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter
  } = useStudents();
  
  const [openStudentForm, setOpenStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [viewingStudent, setViewingStudent] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const handleAddEditStudent = (studentData: any) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
      toast.success(`Aluno ${studentData.name} atualizado com sucesso!`);
    } else {
      addStudent(studentData);
      toast.success(`Aluno ${studentData.name} cadastrado com sucesso!`);
    }
    setOpenStudentForm(false);
    setEditingStudent(null);
  };

  const handleOpenStudentForm = (student?: any) => {
    if (student) {
      setEditingStudent(student);
    } else {
      setEditingStudent(null);
    }
    setOpenStudentForm(true);
  };

  const handleDeleteStudent = () => {
    if (studentToDelete) {
      const student = students.find(s => s.id === studentToDelete);
      deleteStudent(studentToDelete);
      toast.success(`Aluno ${student?.name || ''} removido com sucesso!`);
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setStudentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleViewStudent = (student: any) => {
    setViewingStudent(student);
  };

  const handleToggleStatus = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      toggleStudentStatus(id);
      const newStatus = student.status === "active" ? "inativo" : "ativo";
      toast.success(`Status do aluno ${student.name} alterado para ${newStatus}.`);
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
        title="Alunos"
        subtitle="Gerencie todos os alunos cadastrados no sistema"
        icon={Users}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => handleOpenStudentForm()}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Aluno
        </Button>
      </PageTitle>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar alunos..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={activeFilter === "all" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
              >
                Todos
              </Button>
              <Button 
                variant={activeFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("active")}
                className={activeFilter === "active" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
              >
                Ativos
              </Button>
              <Button 
                variant={activeFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("inactive")}
                className={activeFilter === "inactive" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
              >
                Inativos
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" /> Relatório
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dance-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum aluno encontrado para o filtro selecionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-dance-primary/10 text-dance-primary">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.age} anos</TableCell>
                      <TableCell>{student.modality}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            student.status === "active"
                              ? "border-green-500 bg-green-500/10 text-green-700"
                              : "border-orange-500 bg-orange-500/10 text-orange-700"
                          }
                        >
                          {student.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenStudentForm(student)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Mensalidades
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(student.id)}
                              className={student.status === "active" ? "text-orange-600" : "text-green-600"}
                            >
                              {student.status === "active" ? "Desativar" : "Ativar"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => confirmDelete(student.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Excluir aluno
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredStudents.length} de {students.length} alunos
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </div>

      {/* Student Form Dialog */}
      <Dialog open={openStudentForm} onOpenChange={setOpenStudentForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "Editar Aluno" : "Novo Aluno"}
            </DialogTitle>
            <DialogDescription>
              {editingStudent
                ? "Edite as informações do aluno."
                : "Preencha as informações para cadastrar um novo aluno."}
            </DialogDescription>
          </DialogHeader>
          <StudentForm 
            initialData={editingStudent} 
            onSubmit={handleAddEditStudent} 
            onCancel={() => setOpenStudentForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Student Details Dialog */}
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno</DialogTitle>
          </DialogHeader>
          {viewingStudent && (
            <StudentDetails 
              student={viewingStudent} 
              onEdit={() => {
                setViewingStudent(null);
                handleOpenStudentForm(viewingStudent);
              }}
              onClose={() => setViewingStudent(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
