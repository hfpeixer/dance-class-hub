import React, { useState } from "react";
import { List, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
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
    cancelEnrollment,
    isLoading
  } = useEnrollments();
  
  const [openEnrollmentForm, setOpenEnrollmentForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<any>(null);

  const handleAddEditEnrollment = async (enrollmentData: any) => {
    try {
      if (editingEnrollment) {
        await updateEnrollment(editingEnrollment.id, enrollmentData);
        toast.success(`Matrícula atualizada com sucesso!`);
      } else {
        await addEnrollment(enrollmentData);
        toast.success(`Matrícula registrada com sucesso! As mensalidades foram geradas automaticamente.`);
      }
      setOpenEnrollmentForm(false);
      setEditingEnrollment(null);
    } catch (error) {
      // Error handling is done in the hooks
      console.error('Error saving enrollment:', error);
    }
  };

  const handleOpenEnrollmentForm = (enrollment?: any) => {
    if (enrollment) {
      setEditingEnrollment(enrollment);
    } else {
      setEditingEnrollment(null);
    }
    setOpenEnrollmentForm(true);
  };

  const handleDeleteEnrollment = async (id: string) => {
    try {
      await deleteEnrollment(id);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error deleting enrollment:', error);
    }
  };

  const handleCancelEnrollment = async (id: string) => {
    try {
      await cancelEnrollment(id);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error cancelling enrollment:', error);
    }
  };

  if (isLoading && enrollments.length === 0) {
    return (
      <div className="p-6">
        <PageTitle
          title="Matrículas"
          subtitle="Gerenciar matrículas de alunos nas modalidades"
          icon={List}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

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
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Matrícula
        </Button>
      </PageTitle>

      <EnrollmentsList
        enrollments={enrollments}
        onEdit={handleOpenEnrollmentForm}
        onDelete={handleDeleteEnrollment}
        onCancel={handleCancelEnrollment}
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
                : "Preencha as informações para registrar uma nova matrícula. As mensalidades serão geradas automaticamente."}
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
