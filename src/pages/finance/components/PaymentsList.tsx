
import React, { useState } from "react";
import { DollarSign, Edit, Trash2, Mail, Download, FileText, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Payment } from "../models/types";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface PaymentsListProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const PaymentsList: React.FC<PaymentsListProps> = ({
  payments,
  onEdit,
  onDelete,
  onMarkPaid,
  activeFilter,
  setActiveFilter
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setPaymentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (paymentToDelete) {
      onDelete(paymentToDelete);
      setDeleteConfirmOpen(false);
      setPaymentToDelete(null);
    }
  };

  const sendReminder = (payment: Payment) => {
    toast.success(`Lembrete enviado para ${payment.studentName}`);
  };

  const filteredPayments = payments.filter(payment => {
    // Filtro por status
    const statusMatch = activeFilter === "all" || payment.status === activeFilter;
    
    // Filtro por pesquisa
    const searchMatch = searchQuery.trim() === "" || 
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      payment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pendente</Badge>;
      case "overdue":
        return <Badge className="bg-red-500 hover:bg-red-600">Atrasado</Badge>;
      default:
        return null;
    }
  };

  // Safe formatting function to handle undefined values
  const formatCurrency = (value: number | undefined): string => {
    return value !== undefined ? value.toFixed(2) : "0.00";
  };

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex gap-2">
                <Button 
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className={activeFilter === "all" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
                >
                  Todas
                </Button>
                <Button 
                  variant={activeFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("pending")}
                  className={activeFilter === "pending" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
                >
                  Pendentes
                </Button>
                <Button 
                  variant={activeFilter === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("paid")}
                  className={activeFilter === "paid" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
                >
                  Pagas
                </Button>
                <Button 
                  variant={activeFilter === "overdue" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("overdue")}
                  className={activeFilter === "overdue" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
                >
                  Atrasadas
                </Button>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar mensalidade..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full md:w-[200px]"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Exportar
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhuma mensalidade encontrada para o filtro selecionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-dance-primary/10 text-dance-primary">
                              {getInitials(payment.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{payment.studentName}</p>
                            {payment.installments && payment.currentInstallment && (
                              <p className="text-xs text-muted-foreground">
                                Parcela {payment.currentInstallment}/{payment.installments}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>R$ {formatCurrency(payment.value)}</TableCell>
                      <TableCell>
                        {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                        {payment.status === "paid" && payment.paymentDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Pago em {new Date(payment.paymentDate).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {payment.status !== "paid" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => onMarkPaid(payment.id)}
                                >
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Marcar como pago</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => onEdit(payment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar mensalidade</p>
                            </TooltipContent>
                          </Tooltip>
                          {payment.status === "pending" || payment.status === "overdue" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => sendReminder(payment)}
                                >
                                  <Mail className="h-4 w-4 text-blue-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enviar lembrete</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : null}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => confirmDelete(payment.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir mensalidade</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta mensalidade? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
