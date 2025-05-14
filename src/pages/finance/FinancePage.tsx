
import React, { useState, useEffect } from "react";
import { 
  DollarSign, Plus, Edit, Trash2, FileText, Mail, Download, 
  ArrowDown, ArrowUp, Filter, Check, X, RefreshCcw
} from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useFinanceData } from "@/pages/finance/hooks/useFinanceData";
import { PaymentForm } from "@/pages/finance/components/PaymentForm";
import { FinancialSummary } from "@/pages/finance/components/FinancialSummary";
import { PaymentsList } from "@/pages/finance/components/PaymentsList";
import { TransactionsList } from "@/pages/finance/components/TransactionsList";
import { TransactionForm } from "@/pages/finance/components/TransactionForm";

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [activeFilter, setActiveFilter] = useState("all");
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const { 
    payments,
    transactions,
    addPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useFinanceData();

  const handleNewPayment = () => {
    setPaymentToEdit(null);
    setOpenPaymentDialog(true);
  };

  const handleEditPayment = (payment) => {
    setPaymentToEdit(payment);
    setOpenPaymentDialog(true);
  };

  const handleNewTransaction = (type = 'expense') => {
    setTransactionToEdit({ type });
    setOpenTransactionDialog(true);
  };

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setOpenTransactionDialog(true);
  };

  const handlePaymentSubmit = (data) => {
    if (paymentToEdit) {
      updatePayment(paymentToEdit.id, data);
      toast.success("Mensalidade atualizada com sucesso!");
    } else {
      addPayment(data);
      toast.success("Mensalidade cadastrada com sucesso!");
    }
    setOpenPaymentDialog(false);
  };

  const handleTransactionSubmit = (data) => {
    if (transactionToEdit?.id) {
      updateTransaction(transactionToEdit.id, data);
      toast.success(`${data.type === 'income' ? 'Recebimento' : 'Despesa'} atualizado com sucesso!`);
    } else {
      addTransaction(data);
      toast.success(`${data.type === 'income' ? 'Recebimento' : 'Despesa'} cadastrado com sucesso!`);
    }
    setOpenTransactionDialog(false);
  };

  // Cálculos financeiros
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalReceivedPayments = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, curr) => acc + curr.value, 0);
  
  const totalPendingPayments = payments
    .filter(p => p.status === 'pending')
    .reduce((acc, curr) => acc + curr.value, 0);
  
  const totalOverduePayments = payments
    .filter(p => p.status === 'overdue')
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-6">
      <PageTitle
        title="Financeiro"
        subtitle="Gerencie as mensalidades, recebimentos e despesas da escola"
        icon={DollarSign}
      />

      <div className="mb-6">
        <Tabs defaultValue="payments" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="payments">Mensalidades</TabsTrigger>
              <TabsTrigger value="transactions">Fluxo de Caixa</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              {activeTab === "payments" && (
                <Button 
                  className="bg-dance-primary hover:bg-dance-secondary"
                  onClick={handleNewPayment}
                >
                  <Plus className="mr-2 h-4 w-4" /> Nova Mensalidade
                </Button>
              )}
              
              {activeTab === "transactions" && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => handleNewTransaction('income')}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" /> Recebimento
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => handleNewTransaction('expense')}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" /> Despesa
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="payments" className="space-y-4">
            <FinancialSummary 
              totalReceived={totalReceivedPayments}
              totalPending={totalPendingPayments}
              totalOverdue={totalOverduePayments}
              totalCount={payments.length}
            />
            
            <PaymentsList 
              payments={payments}
              onEdit={handleEditPayment}
              onDelete={deletePayment}
              onMarkPaid={markAsPaid}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Entradas</CardDescription>
                  <CardTitle className="text-2xl font-bold text-green-500">
                    R$ {totalIncome.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Saídas</CardDescription>
                  <CardTitle className="text-2xl font-bold text-red-500">
                    R$ {totalExpenses.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Saldo</CardDescription>
                  <CardTitle className={cn(
                    "text-2xl font-bold",
                    (totalIncome - totalExpenses) >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    R$ {(totalIncome - totalExpenses).toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            <TransactionsList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={deleteTransaction}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Financeiros</CardTitle>
                <CardDescription>
                  Gere relatórios financeiros detalhados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Relatório de Mensalidades</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        Exporta todas as mensalidades por período
                      </p>
                      <div className="flex gap-2">
                        <Input type="date" className="max-w-[160px]" />
                        <Input type="date" className="max-w-[160px]" />
                        <Button className="bg-dance-primary hover:bg-dance-secondary">
                          <Download className="mr-2 h-4 w-4" />
                          Exportar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Relatório de Fluxo de Caixa</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        Exporta entradas e saídas por período
                      </p>
                      <div className="flex gap-2">
                        <Input type="date" className="max-w-[160px]" />
                        <Input type="date" className="max-w-[160px]" />
                        <Button className="bg-dance-primary hover:bg-dance-secondary">
                          <Download className="mr-2 h-4 w-4" />
                          Exportar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {paymentToEdit ? "Editar Mensalidade" : "Nova Mensalidade"}
            </DialogTitle>
            <DialogDescription>
              {paymentToEdit
                ? "Edite as informações da mensalidade."
                : "Preencha as informações para cadastrar uma nova mensalidade."}
            </DialogDescription>
          </DialogHeader>
          <PaymentForm 
            payment={paymentToEdit}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setOpenPaymentDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openTransactionDialog} onOpenChange={setOpenTransactionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {transactionToEdit?.id 
                ? (transactionToEdit.type === 'income' ? "Editar Recebimento" : "Editar Despesa") 
                : (transactionToEdit?.type === 'income' ? "Novo Recebimento" : "Nova Despesa")}
            </DialogTitle>
            <DialogDescription>
              {transactionToEdit?.id
                ? "Edite as informações da transação."
                : "Preencha as informações para registrar a transação."}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm 
            transaction={transactionToEdit}
            onSubmit={handleTransactionSubmit}
            onCancel={() => setOpenTransactionDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
