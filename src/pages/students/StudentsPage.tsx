
import React from "react";
import { Users, Plus, Search } from "lucide-react";
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

const StudentsPage = () => {
  // Mock student data
  const students = [
    {
      id: "1",
      name: "Ana Silva",
      age: 12,
      modality: "Ballet",
      class: "Ballet Infantil - Terça e Quinta",
      status: "active",
    },
    {
      id: "2",
      name: "Lucas Oliveira",
      age: 14,
      modality: "Futsal",
      class: "Futsal Juvenil - Segunda e Quarta",
      status: "active",
    },
    {
      id: "3",
      name: "Maria Santos",
      age: 10,
      modality: "Jazz",
      class: "Jazz Kids - Quarta e Sexta",
      status: "active",
    },
    {
      id: "4",
      name: "Pedro Costa",
      age: 15,
      modality: "Ginástica",
      class: "Ginástica Artística - Terça e Quinta",
      status: "active",
    },
    {
      id: "5",
      name: "Juliana Lima",
      age: 8,
      modality: "Ballet",
      class: "Ballet Infantil - Segunda e Quarta",
      status: "inactive",
    },
  ];

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
        <Button className="bg-dance-primary hover:bg-dance-secondary">
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
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Filtrar</Button>
              <Button variant="outline">Exportar</Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {students.map((student) => (
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
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Mensalidades</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {student.status === "active" ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando 1-5 de 5 alunos
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
    </div>
  );
};

export default StudentsPage;
