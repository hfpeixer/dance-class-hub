
import React, { useState, useEffect } from "react";
import { 
  DollarSign, Plus, ArrowDown, ArrowUp, Receipt, UserPlus
} from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFinanceData } from "@/pages/finance/hooks/useFinanceData";
import { PaymentForm } from "@/pages/finance/components/PaymentForm";
import { FinancialSummary } from "@/pages/finance/components/FinancialSummary";
import { PaymentsList } from "@/pages/finance/components/PaymentsList";
import { TransactionsList } from "@/pages/finance/components/TransactionsList";
import { TransactionForm } from "@/pages/finance/components/TransactionForm";
import { BillsList } from "@/pages/finance/components/BillsList";
import { BillForm } from "@/pages/finance/components/BillForm";
import { EnrollmentsList } from "@/pages/finance/components/EnrollmentsList";
import { EnrollmentForm } from "@/pages/finance/components/EnrollmentForm";

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [activePaymentsFilter, setActivePaymentsFilter] = useState("all");
  const [activeBillsFilter, setActiveBillsFilter] = useState("all");
  const [activeEnrollmentsFilter, setActiveEnrollmentsFilter] = useState("all");
  
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [openEnrollmentDialog, setOpenEnrollmentDialog] = useState(false);
  
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [billToEdit, setBillToEdit] = useState(null);
  const [enrollmentToEdit, setEnrollmentToEdit] = useState(null);

  const { 
    payments,
    transactions,
    bills,
    enrollments,
    addPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    cancelEnrollment
  } = useFinanceData();

  // Verificar pagamentos e contas vencidas
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Atualizar status de mensalidades vencidas
    const updatedPayments = payments.map(payment => {
      if (payment.status === 'pending') {
        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return {
            ...payment,
            status: 'overdue'
          };
        }
      }
      return payment;
    });
    
    // Atualizar status de contas vencidas
    const updatedBills = bills.map(bill => {
      if (bill.status === 'pending') {
        const dueDate = new Date(bill.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          return {
            ...bill,
            status: 'overdue'
          };
        }
      }
      return bill;
    });
    
    // Atualizar apenas se houver mudanças
    const hasPaymentChanges = JSON.stringify(updatedPayments) !== JSON.stringify(payments);
    const hasBillChanges = JSON.stringify(updatedBills) !== JSON.stringify(bills);
    
    // Se houver mudanças, atualizar estado
    if (hasPaymentChanges) {
      payments.forEach((payment, index) => {
        if (payment.status !== updatedPayments[index].status) {
          updatePayment(payment.id, { status: 'overdue' });
        }
      });
    }
    
    if (hasBillChanges) {
      bills.forEach((bill, index) => {
        if (bill.status !== updatedBills[index].status) {
          updateBill(bill.id, { status: 'overdue' });
        }
      });
    }
  }, [payments, bills]);

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

  const handleNewBill = () => {
    setBillToEdit(null);
    setOpenBillDialog(true);
  };

  const handleEditBill = (bill) => {
    setBillToEdit(bill);
    setOpenBillDialog(true);
  };

  const handleNewEnrollment = () => {
    setEnrollmentToEdit(null);
    setOpenEnrollmentDialog(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setEnrollmentToEdit(enrollment);
    setOpenEnrollmentDialog(true);
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

  const handleBillSubmit = (data) => {
    if (billToEdit) {
      updateBill(billToEdit.id, data);
      toast.success("Conta atualizada com sucesso!");
    } else {
      addBill(data);
      toast.success("Conta cadastrada com sucesso!");
    }
    setOpenBillDialog(false);
  };

  const handleEnrollmentSubmit = (data) => {
    if (enrollmentToEdit) {
      updateEnrollment(enrollmentToEdit.id, data);
      toast.success("Matrícula atualizada com sucesso!");
    } else {
      addEnrollment(data);
      toast.success("Matrícula registrada com sucesso!");
    }
    setOpenEnrollmentDialog(false);
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

  const totalPendingBills = bills
    .filter(b => b.status === 'pending')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalOverdueBills = bills
    .filter(b => b.status === 'overdue')
    .reduce((acc, curr) => acc + curr.value, 0);

  const activeEnrollmentsCount = enrollments
    .filter(e => e.status === 'active')
    .length;

  return (
    <div className="p-6 max-w-[100vw] overflow-x-hidden">
      <PageTitle
        title="Financeiro"
        subtitle="Gerencie as mensalidades, recebimentos e despesas da escola"
        icon={DollarSign}
      />

      <div className="mb-6 max-w-full overflow-x-auto">
        <Tabs defaultValue="payments" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="payments">Mensalidades</TabsTrigger>
              <TabsTrigger value="enrollments">Matrículas</TabsTrigger>
              <TabsTrigger value="bills">Contas a Pagar</TabsTrigger>
              <TabsTrigger value="transactions">Fluxo de Caixa</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 ml-auto">
              {activeTab === "payments" && (
                <Button 
                  className="bg-dance-primary hover:bg-dance-secondary"
                  onClick={handleNewPayment}
                >
                  <Plus className="mr-2 h-4 w-4" /> Nova Mensalidade
                </Button>
              )}
              
              {activeTab === "enrollments" && (
                <Button 
                  className="bg-dance-primary hover:bg-dance-secondary"
                  onClick={handleNewEnrollment}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Nova Matrícula
                </Button>
              )}
              
              {activeTab === "bills" && (
                <Button 
                  className="bg-dance-primary hover:bg-dance-secondary"
                  onClick={handleNewBill}
                >
                  <Receipt className="mr-2 h-4 w-4" /> Nova Conta
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
              activeFilter={activePaymentsFilter}
              setActiveFilter={setActivePaymentsFilter}
            />
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Matrículas Ativas</CardDescription>
                  <CardTitle className="text-2xl font-bold text-blue-500">
                    {activeEnrollmentsCount}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total de Matrículas</CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {enrollments.length}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Receita de Mensalidades</CardDescription>
                  <CardTitle className="text-2xl font-bold text-green-500">
                    R$ {totalReceivedPayments.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            <EnrollmentsList
              enrollments={enrollments}
              onEdit={handleEditEnrollment}
              onDelete={deleteEnrollment}
              onCancel={cancelEnrollment}
              activeFilter={activeEnrollmentsFilter}
              setActiveFilter={setActiveEnrollmentsFilter}
            />
          </TabsContent>

          <TabsContent value="bills" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Contas Pendentes</CardDescription>
                  <CardTitle className="text-2xl font-bold text-yellow-500">
                    R$ {totalPendingBills.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Contas Atrasadas</CardDescription>
                  <CardTitle className="text-2xl font-bold text-red-500">
                    R$ {totalOverdueBills.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total de Contas</CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {bills.length}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            <BillsList
              bills={bills}
              onEdit={handleEditBill}
              onDelete={deleteBill}
              onMarkPaid={markBillAsPaid}
              activeFilter={activeBillsFilter}
              setActiveFilter={setActiveBillsFilter}
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
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <Button variant="outline" className="h-auto py-8 flex flex-col">
                  <span className="text-lg mb-2">Relatório de Mensalidades</span>
                  <span className="text-sm text-muted-foreground">Exporta relatório detalhado de mensalidades por período</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-8 flex flex-col">
                  <span className="text-lg mb-2">Relatório de Fluxo de Caixa</span>
                  <span className="text-sm text-muted-foreground">Exporta entradas e saídas detalhadas por período</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-8 flex flex-col">
                  <span className="text-lg mb-2">Relatório de Contas a Pagar</span>
                  <span className="text-sm text-muted-foreground">Exporta relatório de contas por período</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-8 flex flex-col">
                  <span className="text-lg mb-2">Relatório de Matrículas</span>
                  <span className="text-sm text-muted-foreground">Exporta relatório de matrículas por período</span>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Formulário de Mensalidade */}
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

      {/* Modal de Formulário de Transação */}
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

      {/* Modal de Formulário de Conta a Pagar */}
      <Dialog open={openBillDialog} onOpenChange={setOpenBillDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {billToEdit ? "Editar Conta" : "Nova Conta"}
            </DialogTitle>
            <DialogDescription>
              {billToEdit
                ? "Edite as informações da conta."
                : "Preencha as informações para cadastrar uma nova conta."}
            </DialogDescription>
          </DialogHeader>
          <BillForm 
            bill={billToEdit}
            onSubmit={handleBillSubmit}
            onCancel={() => setOpenBillDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Formulário de Matrícula */}
      <Dialog open={openEnrollmentDialog} onOpenChange={setOpenEnrollmentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {enrollmentToEdit ? "Editar Matrícula" : "Nova Matrícula"}
            </DialogTitle>
            <DialogDescription>
              {enrollmentToEdit
                ? "Edite as informações da matrícula."
                : "Preencha as informações para registrar uma nova matrícula."}
            </DialogDescription>
          </DialogHeader>
          <EnrollmentForm 
            enrollment={enrollmentToEdit}
            onSubmit={handleEnrollmentSubmit}
            onCancel={() => setOpenEnrollmentDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
