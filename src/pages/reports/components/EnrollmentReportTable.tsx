
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

export const EnrollmentReportTable = () => {
  // This would normally come from a custom hook or API call
  const enrollments = [
    {
      id: "1",
      studentName: "Ana Silva",
      modality: "Ballet",
      class: "Ballet Infantil - Segunda e Quarta",
      enrollmentDate: "2024-01-15",
      status: "active",
      monthlyFee: 150.00,
    },
    {
      id: "2",
      studentName: "Pedro Santos",
      modality: "Jazz",
      class: "Jazz Teen - Terça e Quinta",
      enrollmentDate: "2024-02-10",
      status: "active",
      monthlyFee: 180.00,
    },
    {
      id: "3",
      studentName: "Mariana Lima",
      modality: "Ballet",
      class: "Ballet Juvenil - Segunda e Sexta",
      enrollmentDate: "2023-11-05",
      status: "inactive",
      monthlyFee: 170.00,
    },
  ];

  const modalityCounts = {
    "Ballet": 2,
    "Jazz": 1,
    "Hip Hop": 0,
    "Futsal": 0,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(modalityCounts).map(([modality, count]) => (
          <div key={modality} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-gray-700 text-sm font-medium">{modality}</p>
            <p className="text-2xl font-bold text-gray-700">{count} alunos</p>
          </div>
        ))}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Modalidade</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Data de matrícula</TableHead>
            <TableHead>Mensalidade</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell className="font-medium">{enrollment.studentName}</TableCell>
              <TableCell>{enrollment.modality}</TableCell>
              <TableCell>{enrollment.class}</TableCell>
              <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
              <TableCell>{formatCurrency(enrollment.monthlyFee)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    enrollment.status === "active"
                      ? "border-green-500 bg-green-500/10 text-green-700"
                      : "border-orange-500 bg-orange-500/10 text-orange-700"
                  }
                >
                  {enrollment.status === "active" ? "Ativa" : "Inativa"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
