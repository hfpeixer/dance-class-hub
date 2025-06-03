
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Modality {
  id: string;
  name: string;
  monthlyFee: number;
  students: number;
  classes: number;
  colorClass: string;
}

interface ModalityCardProps {
  modality: Modality;
  onEdit: (modality: Modality) => void;
  onDelete: (id: string) => void;
}

export const ModalityCard: React.FC<ModalityCardProps> = ({
  modality,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden border-border">
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(modality)}
        >
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(modality.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remover
        </Button>
      </CardFooter>
    </Card>
  );
};
