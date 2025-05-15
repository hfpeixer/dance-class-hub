
import React, { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Enrollment } from '../hooks/useFinanceData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface EnrollmentsListProps {
  enrollments: Enrollment[];
  onEdit: (enrollment: Enrollment) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const EnrollmentsList = ({
  enrollments,
  onEdit,
  onDelete,
  onCancel,
  activeFilter,
  setActiveFilter,
}: EnrollmentsListProps) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const handleConfirmDelete = (id: string) => {
    setConfirmDelete(id);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleConfirmCancel = (id: string) => {
    setConfirmCancel(id);
  };

  const handleCancel = () => {
    if (confirmCancel) {
      onCancel(confirmCancel);
      setConfirmCancel(null);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (activeFilter === 'all') return true;
    return enrollment.status === activeFilter;
  });

  // Ordenar matrículas por data (mais recentes primeiro)
  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className={activeFilter === "all" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
          >
            Todas
          </Button>
          <Button 
            variant={activeFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("active")}
            className={activeFilter === "active" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
          >
            Ativas
          </Button>
          <Button 
            variant={activeFilter === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("inactive")}
            className={activeFilter === "inactive" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
          >
            Inativas
          </Button>
          <Button 
            variant={activeFilter === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("cancelled")}
            className={activeFilter === "cancelled" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
          >
            Canceladas
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhuma matrícula encontrada para o filtro selecionado.
                  </TableCell>
                </TableRow>
              ) : (
                sortedEnrollments.map((enrollment) => (
                  <TableRow 
                    key={enrollment.id}
                    className={cn(
                      enrollment.status === 'cancelled' && 'bg-red-50/50',
                      enrollment.status === 'inactive' && 'bg-orange-50/50'
                    )}
                  >
                    <TableCell>{enrollment.studentName}</TableCell>
                    <TableCell>{enrollment.modalityName}</TableCell>
                    <TableCell>{enrollment.className}</TableCell>
                    <TableCell>{formatDate(enrollment.date)}</TableCell>
                    <TableCell>
                      {formatCurrency(enrollment.value)}
                      {enrollment.installments && enrollment.installments > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {enrollment.installments} parcelas
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          enrollment.status === "active" && "border-green-500 bg-green-500/10 text-green-700",
                          enrollment.status === "inactive" && "border-yellow-500 bg-yellow-500/10 text-yellow-700",
                          enrollment.status === "cancelled" && "border-red-500 bg-red-500/10 text-red-700",
                        )}
                      >
                        {enrollment.status === "active" && "Ativa"}
                        {enrollment.status === "inactive" && "Inativa"}
                        {enrollment.status === "cancelled" && "Cancelada"}
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
                          {enrollment.status !== 'cancelled' && (
                            <DropdownMenuItem onClick={() => onEdit(enrollment)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          {enrollment.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleConfirmCancel(enrollment.id)}>
                              <XCircle className="mr-2 h-4 w-4 text-orange-500" />
                              Cancelar Matrícula
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleConfirmDelete(enrollment.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta matrícula? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!confirmCancel} onOpenChange={() => setConfirmCancel(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta matrícula? As mensalidades pendentes serão marcadas como canceladas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(null)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
