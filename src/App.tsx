
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import StudentsPage from "@/pages/students/StudentsPage";
import TeachersPage from "@/pages/teachers/TeachersPage";
import ClassesPage from "@/pages/classes/ClassesPage";
import ModalitiesPage from "@/pages/modalities/ModalitiesPage";
import SchoolsPage from "@/pages/schools/SchoolsPage";
import FinancePage from "@/pages/finance/FinancePage";
import EnrollmentsPage from "@/pages/finance/EnrollmentsPage";
import ProductsPage from "@/pages/products/ProductsPage";
import EventsPage from "@/pages/events/EventsPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import AdminPage from "@/pages/admin/AdminPage";
import NotFound from "@/pages/NotFound";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/auth" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Index />} />
              
              {/* Student management routes */}
              <Route path="alunos" element={
                <ProtectedRoute requiredPermission="students.manage">
                  <StudentsPage />
                </ProtectedRoute>
              } />
              
              {/* Teacher management routes */}
              <Route path="professores" element={
                <ProtectedRoute requiredPermission="teachers.manage">
                  <TeachersPage />
                </ProtectedRoute>
              } />
              
              {/* Class management routes */}
              <Route path="turmas" element={
                <ProtectedRoute requiredPermission="classes.manage">
                  <ClassesPage />
                </ProtectedRoute>
              } />
              
              {/* Modality management routes */}
              <Route path="modalidades" element={
                <ProtectedRoute requiredPermission="students.manage">
                  <ModalitiesPage />
                </ProtectedRoute>
              } />
              
              {/* School management routes */}
              <Route path="escolas" element={
                <ProtectedRoute requiredPermission="students.manage">
                  <SchoolsPage />
                </ProtectedRoute>
              } />
              
              {/* Finance management routes */}
              <Route path="financeiro" element={
                <ProtectedRoute requiredPermission="finance.manage">
                  <FinancePage />
                </ProtectedRoute>
              } />
              
              <Route path="matriculas" element={
                <ProtectedRoute requiredPermission="finance.manage">
                  <EnrollmentsPage />
                </ProtectedRoute>
              } />
              
              {/* Product management routes */}
              <Route path="produtos" element={
                <ProtectedRoute requiredPermission="finance.manage">
                  <ProductsPage />
                </ProtectedRoute>
              } />
              
              {/* Event management routes */}
              <Route path="eventos" element={
                <ProtectedRoute requiredPermission="students.manage">
                  <EventsPage />
                </ProtectedRoute>
              } />
              
              {/* Reports routes */}
              <Route path="relatorios" element={
                <ProtectedRoute requiredPermission="reports.view">
                  <ReportsPage />
                </ProtectedRoute>
              } />
              
              {/* Settings routes */}
              <Route path="configuracoes" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="admin" element={
                <ProtectedRoute requiredPermission="admin.access">
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
