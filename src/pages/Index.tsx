
import React from "react";
import { BarChart3, Users, School, BookOpen, DollarSign, CalendarClock, UserMinus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PageTitle } from "@/components/layout/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentsChart } from "@/components/dashboard/StudentsChart";
import { FinanceChart } from "@/components/dashboard/FinanceChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const { user } = useAuth();

  // Mock data for the dashboard
  const stats = {
    totalStudents: 155,
    newStudents: 12,
    totalClasses: 28,
    totalTeachers: 14,
    monthlyRevenue: 18750,
    lastMonthRevenue: 17200,
    overduePayments: 8,
    totalOverdueValue: 1200,
    modalityDistribution: [
      { name: "Balé", percentage: 30, color: "#D6BCFA" },
      { name: "Jazz", percentage: 20, color: "#FEC6A1" },
      { name: "Ginástica", percentage: 15, color: "#F2FCE2" },
      { name: "Rítmica", percentage: 15, color: "#FFDEE2" },
      { name: "Futsal", percentage: 20, color: "#D3E4FD" },
    ],
  };

  if (!user) return null;

  return (
    <div className="p-6 animate-fade-in">
      <PageTitle
        title={`Bem-vindo, ${user.name}`}
        subtitle="Painel de controle da escola de dança"
        icon={BarChart3}
      >
        <Button className="bg-dance-primary hover:bg-dance-secondary">Gerar Relatório</Button>
      </PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total de Alunos"
          value={stats.totalStudents}
          icon={Users}
          trend="up"
          trendValue={`+${stats.newStudents} este mês`}
          color="primary"
          className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
        />
        
        <StatsCard
          title="Turmas Ativas"
          value={stats.totalClasses}
          icon={BookOpen}
          color="ballet"
          className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
        />
        
        <StatsCard
          title="Professores"
          value={stats.totalTeachers}
          icon={School}
          color="jazz"
          className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
        />
        
        <StatsCard
          title="Faturamento Mensal"
          value={`R$ ${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue={`+${(((stats.monthlyRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100).toFixed(1)}%`}
          color="ginastica"
          className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4">Distribuição de Alunos</h3>
            {stats.modalityDistribution.map((modality) => (
              <div key={modality.name} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{modality.name}</span>
                  <span className="text-sm font-medium">{modality.percentage}%</span>
                </div>
                <Progress 
                  value={modality.percentage} 
                  className="h-2" 
                  style={{ backgroundColor: `${modality.color}30` }} 
                />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <StudentsChart />
        
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Mensalidades</h3>
              <Button variant="ghost" size="sm" className="text-dance-primary">Ver todos</Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <UserMinus className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Mensalidades Atrasadas</p>
                    <p className="text-sm text-muted-foreground">{stats.overduePayments} alunos</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-500">
                  R$ {stats.totalOverdueValue.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Próximos Vencimentos</p>
                    <p className="text-sm text-muted-foreground">Próximos 7 dias</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  12 alunos
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full bg-dance-primary hover:bg-dance-secondary">
                Gerenciar Mensalidades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FinanceChart />
    </div>
  );
};

export default Index;
