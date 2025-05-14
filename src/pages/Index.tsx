
import React from "react";
import { BarChart3, Users, BookOpen, DollarSign, AlertCircle } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StudentsChart } from "@/components/dashboard/StudentsChart";
import { FinanceChart } from "@/components/dashboard/FinanceChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  // Mock data for overdue payments
  const overduePayments = [
    { student: "Ana Silva", modality: "Ballet", amount: 120, daysLate: 5 },
    { student: "Lucas Oliveira", modality: "Futsal", amount: 100, daysLate: 8 },
    { student: "Maria Santos", modality: "Jazz", amount: 120, daysLate: 3 },
    { student: "Pedro Costa", modality: "Ginástica", amount: 150, daysLate: 12 },
  ];

  // Mock data for classes by teacher
  const classesByTeacher = [
    { teacher: "Juliana Mendes", count: 8, students: 45, color: "#9b87f5" },
    { teacher: "Ricardo Almeida", count: 6, students: 35, color: "#6E59A5" },
    { teacher: "Carla Ferreira", count: 5, students: 28, color: "#D6BCFA" },
    { teacher: "Roberto Santos", count: 4, students: 30, color: "#7E69AB" },
  ];

  return (
    <div className="p-6">
      <PageTitle
        title="Dashboard"
        subtitle="Bem-vindo ao sistema de gerenciamento da escola de dança"
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Alunos Matriculados"
          value="155"
          icon={Users}
          description="Total de alunos ativos"
          trend="up"
          trendValue="12% (último mês)"
          color="ballet"
        />
        <StatsCard
          title="Turmas Ativas"
          value="23"
          icon={BookOpen}
          description="Distribuídas em 5 modalidades"
          color="jazz"
        />
        <StatsCard
          title="Faturamento Mensal"
          value="R$ 18.750"
          icon={DollarSign}
          description="Mês atual (até hoje)"
          trend="up"
          trendValue="8% (mês anterior)"
          color="ginastica"
        />
        <StatsCard
          title="Mensalidades em Atraso"
          value="12"
          icon={AlertCircle}
          description="Total de R$ 1.580"
          trend="down"
          trendValue="3% (mês anterior)"
          color="ritmica"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <StudentsChart />
        <FinanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mensalidades em Atraso</CardTitle>
            <CardDescription>Alunos com pagamentos pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overduePayments.map((payment) => (
                <div key={payment.student} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{payment.student}</p>
                    <p className="text-sm text-muted-foreground">{payment.modality} - {payment.daysLate} dias de atraso</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-destructive">Vencido</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turmas por Professor</CardTitle>
            <CardDescription>Distribuição de turmas e alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classesByTeacher.map((item) => (
                <div key={item.teacher} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.teacher}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.count} turmas · {item.students} alunos
                    </p>
                  </div>
                  <Progress
                    value={(item.count / 10) * 100}
                    className="h-2"
                    style={{ backgroundColor: `${item.color}30` }}
                    indicatorStyle={{ backgroundColor: item.color }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
