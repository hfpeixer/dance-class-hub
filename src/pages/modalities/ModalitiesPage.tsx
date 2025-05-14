
import React from "react";
import { Music2, Plus, Edit, Trash2 } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ModalitiesPage = () => {
  // Mock modalities data
  const modalities = [
    {
      id: "1",
      name: "Ballet",
      monthlyFee: 150,
      students: 45,
      classes: 4,
      colorClass: "bg-modalidades-ballet",
    },
    {
      id: "2",
      name: "Jazz",
      monthlyFee: 140,
      students: 30,
      classes: 3,
      colorClass: "bg-modalidades-jazz",
    },
    {
      id: "3",
      name: "Ginástica Artística",
      monthlyFee: 160,
      students: 25,
      classes: 3,
      colorClass: "bg-modalidades-ginastica",
    },
    {
      id: "4",
      name: "Ginástica Rítmica",
      monthlyFee: 160,
      students: 20,
      classes: 2,
      colorClass: "bg-modalidades-ritmica",
    },
    {
      id: "5",
      name: "Futsal",
      monthlyFee: 120,
      students: 35,
      classes: 4,
      colorClass: "bg-modalidades-futsal",
    },
  ];

  return (
    <div className="p-6">
      <PageTitle
        title="Modalidades"
        subtitle="Gerencie as modalidades de dança e esportes oferecidas"
        icon={Music2}
      >
        <Button className="bg-dance-primary hover:bg-dance-secondary">
          <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modalities.map((modality) => (
          <Card key={modality.id} className="overflow-hidden border-border">
            <div className={`h-2 w-full ${modality.colorClass}`} />
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center justify-between">
                {modality.name}
                <Badge variant="outline" className="ml-2">
                  R$ {modality.monthlyFee}/mês
                </Badge>
              </CardTitle>
              <CardDescription>
                {modality.students} alunos em {modality.classes} turmas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <p className="text-sm font-medium">Alunos</p>
                  <p className="text-2xl font-bold">{modality.students}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Turmas</p>
                  <p className="text-2xl font-bold">{modality.classes}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4 flex justify-between">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" /> Remover
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModalitiesPage;
