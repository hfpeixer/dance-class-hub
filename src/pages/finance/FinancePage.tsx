
import React, { useState } from "react";
import { DollarSign, Plus, Edit, Trash2, FileText, Mail, Download } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  value: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paymentDate?: string;
}

const paymentFormSchema = z.object({
  studentId: z.string().min(1, "Aluno é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  status: z.enum(["paid", "pending", "overdue"]),
  paymentDate: z.string().optional(),
});

const FinancePage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "paid" | "overdue">("all");

  // Mock students
  const students = [
    { id: "1", name: "Ana Silva", modality: "Ballet" },
    { id: "2", name: "Lucas Oliveira", modality: "Futsal" },
    { id: "3", name: "Maria Santos", modality: "Jazz" },
    { id: "4", name: "Pedro Costa", modality: "Ginástica" },
    { id: "5", name: "Juliana Lima", modality: "Ballet" },
  ];

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: "",
      description: "",
      value: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: "pending",
      paymentDate: "",
    },
  });

  const onOpenDialog = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      form.setValue("studentId", payment.studentId);
      form.setValue("description", payment.description);
      form.setValue("value", payment.value);
      form.setValue("dueDate", payment.dueDate);
      form.setValue("status", payment.status);
      form.setValue("paymentDate", payment.paymentDate || "");
    } else {
      setEditingPayment(null);
      form.reset({
        studentId: "",
        description: "",
        value: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: "pending",
        paymentDate: "",
      });
    }
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof paymentFormSchema>) => {
    const student = students.find(s => s.id === values.studentId);
    
    if (!student) {
      toast.error("Aluno não encontrado!");
      return;
    }
    
    if (editingPayment) {
      // Update existing payment
      const updatedPayments = payments.map((p) =>
        p.id === editingPayment.id
          ? {
              ...p,
              studentId: values.studentId,
              studentName: student.name,
              description: values.description,
              value: values.value,
              dueDate: values.dueDate,
              status: values.status,
              paymentDate: values.status === "paid" ? (values.paymentDate || new Date().toISOString().split('T')[0]) : undefined,
            }
          : p
      );
      setPayments(updatedPayments);
      toast.success("Mensalidade atualizada com sucesso!");
    } else {
      // Add new payment
      const newPayment: Payment = {
        id: Date.now().toString(),
        studentId: values.studentId,
        studentName: student.name,
        description: values.description,
        value: values.value,
        dueDate: values.dueDate,
        status: values.status,
        paymentDate: values.status === "paid" ? (values.paymentDate || new Date().toISOString().split('T')[0]) : undefined,
      };
      setPayments([...payments, newPayment]);
      toast.success("Mensalidade cadastrada com sucesso!");
    }
    onCloseDialog();
  };

  const confirmDelete = (id: string) => {
    setPaymentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const deletePayment = () => {
    if (paymentToDelete) {
      setPayments(payments.filter((p) => p.id !== paymentToDelete));
      toast.success("Mensalidade removida com sucesso!");
      setDeleteConfirmOpen(false);
      setPaymentToDelete(null);
    }
  };

  const markAsPaid = (id: string) => {
    const updatedPayments = payments.map((p) =>
      p.id === id
        ? {
            ...p,
            status: "paid" as const,
            paymentDate: new Date().toISOString().split('T')[0],
          }
        : p
    );
    setPayments(updatedPayments);
    toast.success("Pagamento registrado com sucesso!");
  };
  
  const sendReminder = (payment: Payment) => {
    toast.success(`Lembrete enviado para ${payment.studentName}`);
  };

  const filteredPayments = payments.filter(payment => {
    if (activeFilter === "all") return true;
    return payment.status === activeFilter;
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

  return (
    <div className="p-6">
      <PageTitle
        title="Financeiro"
        subtitle="Gerencie as mensalidades e pagamentos"
        icon={DollarSign}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => onOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Mensalidade
        </Button>
      </PageTitle>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <DollarSign className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhuma mensalidade cadastrada</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre sua primeira mensalidade para começar.
              </p>
              <Button 
                className="bg-dance-primary hover:bg-dance-secondary"
                onClick={() => onOpenDialog()}
              >
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Mensalidade
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6 mt-6">
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Mensalidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.length}</div>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {payments.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Recebido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  R$ {payments.filter(p => p.status === "paid").reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pendente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  R$ {payments.filter(p => p.status === "pending").reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Exportar
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" /> Relatório
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
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>R$ {payment.value.toFixed(2)}</TableCell>
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
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => markAsPaid(payment.id)}
                                  title="Marcar como pago"
                                >
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => onOpenDialog(payment)}
                                title="Editar mensalidade"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {payment.status === "pending" || payment.status === "overdue" ? (
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => sendReminder(payment)}
                                  title="Enviar lembrete"
                                >
                                  <Mail className="h-4 w-4 text-blue-600" />
                                </Button>
                              ) : null}
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => confirmDelete(payment.id)}
                                className="text-destructive hover:text-destructive"
                                title="Excluir mensalidade"
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
        </>
      )}

      {/* Payment Form Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? "Editar Mensalidade" : "Nova Mensalidade"}
            </DialogTitle>
            <DialogDescription>
              {editingPayment
                ? "Edite as informações da mensalidade."
                : "Preencha as informações para cadastrar uma nova mensalidade."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aluno</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o aluno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - {student.modality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Mensalidade Julho/2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="overdue">Atrasado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("status") === "paid" && (
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Pagamento</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          value={field.value || new Date().toISOString().split('T')[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
                  {editingPayment ? "Salvar Alterações" : "Cadastrar Mensalidade"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
            <Button variant="destructive" onClick={deletePayment}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
