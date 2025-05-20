
import React, { useState } from "react";
import { FileText, Download, Calendar, Users, DollarSign, List } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentReportTable } from "./components/StudentReportTable";
import { FinancialReportTable } from "./components/FinancialReportTable";
import { EnrollmentReportTable } from "./components/EnrollmentReportTable";
import { EventsReportTable } from "./components/EventsReportTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./components/DatePicker";

const ReportsPage = () => {
  const [reportType, setReportType] = useState("students");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  
  const handleExport = () => {
    // In the future, this would be connected to actual export functionality
    console.log("Export report:", reportType, dateRange);
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Relatórios"
        subtitle="Gere relatórios sobre alunos, financeiro, matrículas e eventos"
        icon={FileText}
      >
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="cursor-pointer hover:border-dance-primary transition-colors" 
          onClick={() => setReportType("students")}>
          <CardContent className={`p-4 flex items-center gap-4 ${reportType === "students" ? "bg-dance-primary/10 border-dance-primary" : ""}`}>
            <Users className="h-8 w-8 text-dance-primary" />
            <div>
              <CardTitle className="text-lg mb-1">Alunos</CardTitle>
              <CardDescription className="text-xs m-0">Relatórios de alunos</CardDescription>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-dance-primary transition-colors" 
          onClick={() => setReportType("financial")}>
          <CardContent className={`p-4 flex items-center gap-4 ${reportType === "financial" ? "bg-dance-primary/10 border-dance-primary" : ""}`}>
            <DollarSign className="h-8 w-8 text-dance-primary" />
            <div>
              <CardTitle className="text-lg mb-1">Financeiro</CardTitle>
              <CardDescription className="text-xs m-0">Relatórios financeiros</CardDescription>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-dance-primary transition-colors" 
          onClick={() => setReportType("enrollments")}>
          <CardContent className={`p-4 flex items-center gap-4 ${reportType === "enrollments" ? "bg-dance-primary/10 border-dance-primary" : ""}`}>
            <List className="h-8 w-8 text-dance-primary" />
            <div>
              <CardTitle className="text-lg mb-1">Matrículas</CardTitle>
              <CardDescription className="text-xs m-0">Relatórios de matrículas</CardDescription>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-dance-primary transition-colors" 
          onClick={() => setReportType("events")}>
          <CardContent className={`p-4 flex items-center gap-4 ${reportType === "events" ? "bg-dance-primary/10 border-dance-primary" : ""}`}>
            <Calendar className="h-8 w-8 text-dance-primary" />
            <div>
              <CardTitle className="text-lg mb-1">Eventos</CardTitle>
              <CardDescription className="text-xs m-0">Relatórios de eventos</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <CardTitle>
              {reportType === "students" && "Relatório de Alunos"}
              {reportType === "financial" && "Relatório Financeiro"}
              {reportType === "enrollments" && "Relatório de Matrículas"}
              {reportType === "events" && "Relatório de Eventos"}
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
              {reportType === "students" && (
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os alunos</SelectItem>
                    <SelectItem value="active">Alunos ativos</SelectItem>
                    <SelectItem value="inactive">Alunos inativos</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {reportType === "financial" && (
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as transações</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {reportType === "enrollments" && (
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as modalidades</SelectItem>
                    <SelectItem value="ballet">Ballet</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="hip-hop">Hip Hop</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {reportType === "events" && (
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os eventos</SelectItem>
                    <SelectItem value="upcoming">Programados</SelectItem>
                    <SelectItem value="completed">Concluídos</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reportType === "students" && <StudentReportTable />}
          {reportType === "financial" && <FinancialReportTable />}
          {reportType === "enrollments" && <EnrollmentReportTable />}
          {reportType === "events" && <EventsReportTable />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
