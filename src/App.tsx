
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import Index from "./pages/Index";
import StudentsPage from "./pages/students/StudentsPage";
import SchoolsPage from "./pages/schools/SchoolsPage";
import ModalitiesPage from "./pages/modalities/ModalitiesPage";
import TeachersPage from "./pages/teachers/TeachersPage";
import ClassesPage from "./pages/classes/ClassesPage";
import FinancePage from "./pages/finance/FinancePage";
import ProductsPage from "./pages/products/ProductsPage";
import EventsPage from "./pages/events/EventsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import AdminPage from "./pages/admin/AdminPage";
import NotFound from "./pages/NotFound";

import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredPermission?: string }> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dance-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Verificar permissão se necessário
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout component with sidebar and header
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  // Create a new QueryClient instance
  const [queryClient] = React.useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Index />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/alunos"
                element={
                  <ProtectedRoute requiredPermission="students.manage">
                    <Layout>
                      <StudentsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/escolas"
                element={
                  <ProtectedRoute requiredPermission="students.manage">
                    <Layout>
                      <SchoolsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/modalidades"
                element={
                  <ProtectedRoute requiredPermission="students.manage">
                    <Layout>
                      <ModalitiesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/professores"
                element={
                  <ProtectedRoute requiredPermission="teachers.manage">
                    <Layout>
                      <TeachersPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/turmas"
                element={
                  <ProtectedRoute requiredPermission="classes.manage">
                    <Layout>
                      <ClassesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/financeiro"
                element={
                  <ProtectedRoute requiredPermission="finance.manage">
                    <Layout>
                      <FinancePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/produtos"
                element={
                  <ProtectedRoute requiredPermission="finance.manage">
                    <Layout>
                      <ProductsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/eventos"
                element={
                  <ProtectedRoute requiredPermission="finance.manage">
                    <Layout>
                      <EventsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredPermission="admin.access">
                    <Layout>
                      <AdminPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/configuracoes"
                element={
                  <ProtectedRoute requiredPermission="dashboard.view">
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
