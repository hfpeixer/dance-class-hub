
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentsByModality {
  name: string;
  students: number;
  color: string;
}

interface StudentsChartProps {
  data: StudentsByModality[];
}

export const StudentsChart: React.FC<StudentsChartProps> = ({ data }) => {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Alunos por Modalidade</CardTitle>
        <CardDescription>Distribuição de alunos entre as modalidades oferecidas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-md p-2 shadow-sm">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-sm">
                            <span className="font-medium">Alunos:</span> {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="students"
                  radius={[4, 4, 0, 0]}
                  fill="#9b87f5"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
