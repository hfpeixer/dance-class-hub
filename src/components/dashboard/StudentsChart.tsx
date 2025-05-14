
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for the chart
const data = [
  { name: "Balé", students: 45, color: "#D6BCFA" },
  { name: "Jazz", students: 30, color: "#FEC6A1" },
  { name: "Ginástica", students: 25, color: "#F2FCE2" },
  { name: "Rítmica", students: 20, color: "#FFDEE2" },
  { name: "Futsal", students: 35, color: "#D3E4FD" },
];

export const StudentsChart: React.FC = () => {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Alunos por Modalidade</CardTitle>
        <CardDescription>Distribuição de alunos entre as modalidades oferecidas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" />
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
        </div>
      </CardContent>
    </Card>
  );
};
