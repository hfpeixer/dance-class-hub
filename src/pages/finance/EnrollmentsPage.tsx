
import React, { useState } from "react";
import { List, Plus, Search } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EnrollmentForm } from "./components/EnrollmentForm";
import { EnrollmentsList } from "./components/EnrollmentsList";
import { useEnrollments } from "./hooks/useEnrollments";

const EnrollmentsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const {
    enrollments,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    cancelEnrollment
  } = useEnrollments();
  
  const [openEnrollmentForm, setOpenEnrollmentForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<any>(null);

  const handleAddEditEnrollment = (enrollmentData: any) => {
    if (editingEnrollment) {
      updateEnrollment(editingEnrollment.id, enrollmentData);
      toast.success(`Matrícula atualizada com sucesso!`);
    } else {
      addEnrollment(enrollmentData);
      toast.success(`Matrícula registrada com sucesso!`);
    }
    setOpenEnrollmentForm(false);
    setEditingEnrollment(null);
  };

  const handleOpenEnrollmentForm = (enrollment?: any) => {
    if (enrollment) {
      setEditingEnrollment(enrollment);
    } else {
      setEditingEnrollment(null);
    }
    setOpenEnrollmentForm(true);
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Matrículas"
        subtitle="Gerenciar matrículas de alunos nas modalidades"
        icon={List}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => handleOpenEnrollmentForm()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Matrícula
        </Button>
      </PageTitle>

      <EnrollmentsList
        enrollments={enrollments}
        onEdit={handleOpenEnrollmentForm}
        onDelete={deleteEnrollment}
        onCancel={cancelEnrollment}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Enrollment Form Dialog */}
      <Dialog open={openEnrollmentForm} onOpenChange={setOpenEnrollmentForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEnrollment ? "Editar Matrícula" : "Nova Matrícula"}
            </DialogTitle>
            <DialogDescription>
              {editingEnrollment
                ? "Edite as informações da matrícula."
                : "Preencha as informações para registrar uma nova matrícula."}
            </DialogDescription>
          </DialogHeader>
          <EnrollmentForm 
            enrollment={editingEnrollment} 
            onSubmit={handleAddEditEnrollment} 
            onCancel={() => setOpenEnrollmentForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnrollmentsPage;
