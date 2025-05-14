
import React, { useState } from "react";
import { Edit, Trash2, ArrowDown, ArrowUp } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "../hooks/useFinanceData";
import { cn } from "@/lib/utils";

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("month");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete);
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    }
  };

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    // Filtrar por tipo
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter;
    
    // Filtrar por categoria
    const categoryMatch = categoryFilter === "all" || transaction.category === categoryFilter;
    
    // Filtrar por período
    let periodMatch = true;
    const today = new Date();
    const transactionDate = new Date(transaction.date);
    
    if (periodFilter === "today") {
      periodMatch = (
        transactionDate.getDate() === today.getDate() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    } else if (periodFilter === "week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      periodMatch = transactionDate >= weekStart;
    } else if (periodFilter === "month") {
      periodMatch = (
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    } else if (periodFilter === "year") {
      periodMatch = transactionDate.getFullYear() === today.getFullYear();
    }
    
    // Filtrar por pesquisa
    const searchMatch = searchQuery.trim() === "" || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      transaction.relatedTo?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && categoryMatch && periodMatch && searchMatch;
  });

  // Ordenar transações por data (mais recentes primeiro)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Obter todas as categorias para o filtro
  const uniqueCategories = [...new Set(transactions.map(t => t.category))];

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex gap-2">
                <Button 
                  variant={typeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("all")}
                  className={typeFilter === "all" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
                >
                  Todas
                </Button>
                <Button 
                  variant={typeFilter === "income" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("income")}
                  className={typeFilter === "income" ? "bg-green-500 hover:bg-green-600" : "text-green-500"}
                >
                  <ArrowDown className="h-4 w-4 mr-1" /> Entradas
                </Button>
                <Button 
                  variant={typeFilter === "expense" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("expense")}
                  className={typeFilter === "expense" ? "bg-red-500 hover:bg-red-600" : "text-red-500"}
                >
                  <ArrowUp className="h-4 w-4 mr-1" /> Saídas
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select 
                  value={periodFilter}
                  onValueChange={setPeriodFilter}
                >
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                    <SelectItem value="all">Todos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Buscar..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full md:w-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhuma transação encontrada para o filtro selecionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.type === "income" ? (
                          <Badge className="bg-green-500">Entrada</Badge>
                        ) : (
                          <Badge className="bg-red-500">Saída</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.relatedTo && (
                            <p className="text-xs text-muted-foreground">
                              {transaction.relatedTo}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={cn(
                        "font-medium",
                        transaction.type === "income" ? "text-green-500" : "text-red-500"
                      )}>
                        R$ {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {transaction.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => onEdit(transaction)}
                            title="Editar transação"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => confirmDelete(transaction.id)}
                            className="text-destructive hover:text-destructive"
                            title="Excluir transação"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
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
    </>
  );
};
