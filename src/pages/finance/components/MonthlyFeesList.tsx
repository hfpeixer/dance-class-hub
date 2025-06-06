
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Calendar, DollarSign, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MonthlyFee } from "../hooks/useMonthlyFees";

interface MonthlyFeesListProps {
  monthlyFees: MonthlyFee[];
  onMarkPaid: (id: string, paymentMethod?: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const MonthlyFeesList = ({ 
  monthlyFees, 
  onMarkPaid, 
  activeFilter, 
  setActiveFilter 
}: MonthlyFeesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
      paid: { variant: "default", label: "Paga", color: "bg-green-100 text-green-800" },
      overdue: { variant: "destructive", label: "Atrasada", color: "bg-red-100 text-red-800" },
      cancelled: { variant: "outline", label: "Cancelada", color: "bg-gray-100 text-gray-800" }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge className={cn("text-xs", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const filteredFees = monthlyFees.filter(fee => {
    const matchesFilter = activeFilter === "all" || fee.status === activeFilter;
    const matchesSearch = fee.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.month_year.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "paid", "overdue", "cancelled"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              size="sm"
              className="text-xs"
            >
              {filter === "all" ? "Todas" : 
               filter === "pending" ? "Pendentes" :
               filter === "paid" ? "Pagas" :
               filter === "overdue" ? "Atrasadas" : "Canceladas"}
            </Button>
          ))}
        </div>
        
        <Input
          placeholder="Buscar por aluno ou mês..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {monthlyFees.filter(f => f.status === 'pending').length}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(monthlyFees.filter(f => f.status === 'pending').reduce((acc, f) => acc + f.amount, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {monthlyFees.filter(f => f.status === 'paid').length}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(monthlyFees.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Atrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {monthlyFees.filter(f => f.status === 'overdue').length}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(monthlyFees.filter(f => f.status === 'overdue').reduce((acc, f) => acc + f.amount, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyFees.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(monthlyFees.reduce((acc, f) => acc + f.amount, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Fees List */}
      <div className="grid gap-4">
        {filteredFees.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Nenhuma mensalidade encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          filteredFees.map((fee) => (
            <Card key={fee.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{fee.student_name}</span>
                      {getStatusBadge(fee.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Venc: {formatDate(fee.due_date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(fee.amount)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span>Ref: {fee.month_year}</span>
                      </div>
                    </div>

                    {fee.payment_date && (
                      <div className="text-xs text-green-600">
                        Pago em {formatDate(fee.payment_date)} via {fee.payment_method}
                      </div>
                    )}

                    {fee.notes && (
                      <div className="text-xs text-muted-foreground">
                        {fee.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {fee.status === "pending" || fee.status === "overdue" ? (
                      <Button
                        size="sm"
                        onClick={() => onMarkPaid(fee.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marcar como Paga
                      </Button>
                    ) : null}
                    
                    {fee.status === "overdue" && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
