
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for the chart - Monthly revenue
const data = [
  { month: "Jan", revenue: 12500, expenses: 8000 },
  { month: "Fev", revenue: 13200, expenses: 8200 },
  { month: "Mar", revenue: 14800, expenses: 8400 },
  { month: "Abr", revenue: 15200, expenses: 8600 },
  { month: "Mai", revenue: 16500, expenses: 9000 },
  { month: "Jun", revenue: 17800, expenses: 9200 },
];

export const FinanceChart: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Faturamento Mensal</CardTitle>
        <CardDescription>Receitas e despesas dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `R$ ${value/1000}k`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Mês: ${label}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Receitas"
                stroke="#9b87f5"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Despesas"
                stroke="#ff6b6b"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
