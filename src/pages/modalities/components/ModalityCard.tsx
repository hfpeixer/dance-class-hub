
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, GraduationCap, DollarSign } from "lucide-react";
import { Modality } from "../hooks/useModalities";

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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className={`${modality.colorClass || 'bg-white'} border-l-4 border-l-dance-primary hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-2">
              {modality.name}
            </CardTitle>
            {modality.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {modality.description}
              </p>
            )}
          </div>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(modality)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(modality.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>{modality.students || 0} alunos</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <GraduationCap className="h-4 w-4 mr-1" />
              <span>{modality.classes || 0} turmas</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mensalidade:</span>
              <Badge variant="outline" className="font-semibold">
                <DollarSign className="h-3 w-3 mr-1" />
                {formatCurrency(modality.monthly_fee)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Matrícula:</span>
              <Badge variant="secondary" className="font-semibold">
                <DollarSign className="h-3 w-3 mr-1" />
                {formatCurrency(modality.enrollment_fee)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
