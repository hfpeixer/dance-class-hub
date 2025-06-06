import React, { useState } from 'react';
import { Check, Edit, Trash2, Filter, Calendar } from 'lucide-react';
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
import { Bill } from '../models/types';
import { PAYMENT_METHODS } from '../models/constants';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BillsListProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string, paymentMethod: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const BillsList = ({
  bills,
  onEdit,
  onDelete,
  onMarkPaid,
  activeFilter,
  setActiveFilter,
}: BillsListProps) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<Bill | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("Dinheiro");

  const handleConfirmDelete = (id: string) => {
    setConfirmDelete(id);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const openPaymentModal = (bill: Bill) => {
    setPaymentModal(bill);
    setSelectedPaymentMethod("Dinheiro"); // Reset to default
  };

  const handlePayment = () => {
    if (paymentModal) {
      onMarkPaid(paymentModal.id, selectedPaymentMethod);
      setPaymentModal(null);
    }
  };

  const filteredBills = bills.filter(bill => {
    if (activeFilter === 'all') return true;
    return bill.status === activeFilter;
  });

  // Ordenar contas por data de vencimento (mais próximas primeiro)
  const sortedBills = [...filteredBills].sort((a, b) => {
    // Contas atrasadas primeiro
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    
    // Depois por data de vencimento
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-700">Paga</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 bg-yellow-500/10 text-yellow-700">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="border-red-500 bg-red-500/10 text-red-700">Atrasada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Check if bill is overdue
  const checkOverdueBills = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bills.map(bill => {
      if (bill.status === 'pending') {
        const dueDate = new Date(bill.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return { ...bill, status: 'overdue' };
        }
      }
      return bill;
    });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 sm:justify-between">
          <div className="flex flex-wrap gap-2">
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
              variant={activeFilter === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("overdue")}
              className={activeFilter === "overdue" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
            >
              Atrasadas
            </Button>
            <Button 
              variant={activeFilter === "paid" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("paid")}
              className={activeFilter === "paid" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
            >
              Pagas
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhuma conta encontrada para o filtro selecionado.
                  </TableCell>
                </TableRow>
              ) : (
                sortedBills.map((bill) => (
                  <TableRow key={bill.id} className={bill.status === 'overdue' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="font-medium">{bill.description}</div>
                      {bill.installments && bill.installments > 1 && bill.currentInstallment && (
                        <div className="text-xs text-muted-foreground">
                          Parcela {bill.currentInstallment}/{bill.installments}
                        </div>
                      )}
                      {bill.documentNumber && (
                        <div className="text-xs text-muted-foreground">
                          Doc: {bill.documentNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{bill.supplier}</TableCell>
                    <TableCell>{bill.category}</TableCell>
                    <TableCell>{formatCurrency(bill.value)}</TableCell>
                    <TableCell>
                      {formatDate(bill.dueDate)}
                      {bill.paymentDate && (
                        <div className="text-xs text-muted-foreground">
                          Pago em: {formatDate(bill.paymentDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
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
                          {bill.status !== 'paid' && (
                            <DropdownMenuItem onClick={() => openPaymentModal(bill)}>
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              Registrar Pagamento
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onEdit(bill)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleConfirmDelete(bill.id)}
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
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
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

      {/* Payment Modal */}
      <Dialog open={!!paymentModal} onOpenChange={() => setPaymentModal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Registrar pagamento da conta: {paymentModal?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <h4 className="font-medium mb-1">Valor:</h4>
              <p>{paymentModal && formatCurrency(paymentModal.value)}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Forma de Pagamento:</h4>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Data:</h4>
              <p>{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModal(null)}>
              Cancelar
            </Button>
            <Button onClick={handlePayment} className="bg-dance-primary hover:bg-dance-secondary">
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
