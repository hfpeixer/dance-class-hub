
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const StudentReportTable = () => {
  // This would normally come from a custom hook or API call
  const students = [
    {
      id: "1",
      name: "Ana Silva",
      modality: "Ballet",
      class: "Ballet Infantil - Segunda e Quarta",
      age: 9,
      status: "active",
      enrollmentDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Pedro Santos",
      modality: "Jazz",
      class: "Jazz Teen - Terça e Quinta",
      age: 14,
      status: "active",
      enrollmentDate: "2024-02-10",
    },
    {
      id: "3",
      name: "Mariana Lima",
      modality: "Ballet",
      class: "Ballet Juvenil - Segunda e Sexta",
      age: 12,
      status: "inactive",
      enrollmentDate: "2023-11-05",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Modalidade</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Data de matrícula</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.age} anos</TableCell>
              <TableCell>{student.modality}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{formatDate(student.enrollmentDate)}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
