
import React from "react";
import { Button } from "@/components/ui/button";
import { Student } from "../hooks/useStudents";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  File,
  Edit,
} from "lucide-react";

type StudentDetailsProps = {
  student: Student;
  onEdit: () => void;
  onClose: () => void;
};

export const StudentDetails = ({ student, onEdit, onClose }: StudentDetailsProps) => {
  // Format the date to Brazilian format (dd/mm/yyyy)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-dance-primary/10 flex items-center justify-center text-dance-primary text-xl font-bold">
          {student.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
        </div>
        <div>
          <h3 className="text-xl font-bold">{student.name}</h3>
          <p className="text-muted-foreground">{student.modality} | {student.class}</p>
          <Badge
            variant="outline"
            className={
              student.status === "active"
                ? "border-green-500 bg-green-500/10 text-green-700 mt-1"
                : "border-orange-500 bg-orange-500/10 text-orange-700 mt-1"
            }
          >
            {student.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Informações Básicas</h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Idade:</span> 
              <span>{student.age} anos</span>
            </div>
            
            {student.birthday && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Data de nascimento:</span> 
                <span>{formatDate(student.birthday)}</span>
              </div>
            )}
            
            {student.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Email:</span> 
                <span>{student.email}</span>
              </div>
            )}
            
            {student.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Telefone:</span> 
                <span>{student.phone}</span>
              </div>
            )}
            
            {student.enrollmentDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Data de matrícula:</span> 
                <span>{formatDate(student.enrollmentDate)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Endereço</h4>
          <div className="space-y-2">
            {student.address && (
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Endereço:</span> 
                  <p>{student.address}</p>
                  {student.cityState && <p>{student.cityState}</p>}
                  {student.zipCode && <p>CEP: {student.zipCode}</p>}
                </div>
              </div>
            )}
            
            {!student.address && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Endereço não cadastrado</span>
              </div>
            )}
          </div>

          <h4 className="text-sm font-medium mt-4">Responsável</h4>
          <div className="space-y-2">
            {student.parentName && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Responsável:</span> 
                <span>{student.parentName}</span>
              </div>
            )}
            
            {student.parentPhone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Telefone:</span> 
                <span>{student.parentPhone}</span>
              </div>
            )}
            
            {!student.parentName && !student.parentPhone && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Responsável não cadastrado</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {student.notes && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Observações</h4>
          <div className="flex text-sm">
            <File className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
            <p>{student.notes}</p>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button 
          onClick={onEdit}
          className="bg-dance-primary hover:bg-dance-secondary"
        >
          <Edit className="h-4 w-4 mr-2" /> Editar
        </Button>
      </DialogFooter>
    </div>
  );
};
