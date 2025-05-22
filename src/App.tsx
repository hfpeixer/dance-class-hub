
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import StudentsPage from "./pages/students/StudentsPage";
import TeachersPage from "./pages/teachers/TeachersPage";
import ClassesPage from "./pages/classes/ClassesPage";
import ModalitiesPage from "./pages/modalities/ModalitiesPage";
import ProductsPage from "./pages/products/ProductsPage";
import FinancePage from "./pages/finance/FinancePage";
import EnrollmentsPage from "./pages/finance/EnrollmentsPage";
import EventsPage from "./pages/events/EventsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import AdminPage from "./pages/admin/AdminPage";
import SchoolsPage from "./pages/schools/SchoolsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/alunos" element={<StudentsPage />} />
          <Route path="/professores" element={<TeachersPage />} />
          <Route path="/turmas" element={<ClassesPage />} />
          <Route path="/modalidades" element={<ModalitiesPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/financeiro" element={<FinancePage />} />
          <Route path="/matriculas" element={<EnrollmentsPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/escolas" element={<SchoolsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
