
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalModalities: number;
  totalClasses: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  recentEnrollments: number;
}

export interface StudentsByModality {
  name: string;
  students: number;
  color: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalModalities: 0,
    totalClasses: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    recentEnrollments: 0
  });
  
  const [studentsByModality, setStudentsByModality] = useState<StudentsByModality[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const colors = ['#D6BCFA', '#FEC6A1', '#F2FCE2', '#FFDEE2', '#D3E4FD', '#E6F3FF', '#FFE4E1'];

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch students data
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) throw studentsError;

      // Fetch modalities data
      const { data: modalitiesData, error: modalitiesError } = await supabase
        .from('modalities')
        .select('*');

      if (modalitiesError) throw modalitiesError;

      // Fetch classes data
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*');

      if (classesError) throw classesError;

      // Fetch enrollments data
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          modalities(name)
        `);

      if (enrollmentsError) throw enrollmentsError;

      // Fetch payments data
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*');

      if (paymentsError) throw paymentsError;

      // Fetch transactions data for revenue calculation
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'income');

      if (transactionsError) throw transactionsError;

      // Calculate stats
      const totalStudents = studentsData?.length || 0;
      const activeStudents = studentsData?.filter(s => s.status === 'active').length || 0;
      const totalModalities = modalitiesData?.length || 0;
      const totalClasses = classesData?.length || 0;

      // Calculate revenue from paid payments
      const monthlyRevenue = paymentsData
        ?.filter(p => p.status === 'paid')
        .reduce((acc, payment) => acc + Number(payment.value), 0) || 0;

      const pendingPayments = paymentsData
        ?.filter(p => p.status === 'pending')
        .reduce((acc, payment) => acc + Number(payment.value), 0) || 0;

      const overduePayments = paymentsData
        ?.filter(p => p.status === 'overdue')
        .reduce((acc, payment) => acc + Number(payment.value), 0) || 0;

      // Recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentEnrollments = enrollmentsData
        ?.filter(e => new Date(e.created_at) >= thirtyDaysAgo).length || 0;

      setStats({
        totalStudents,
        activeStudents,
        totalModalities,
        totalClasses,
        monthlyRevenue,
        pendingPayments,
        overduePayments,
        recentEnrollments
      });

      // Calculate students by modality
      const modalityCount = new Map();
      enrollmentsData?.forEach(enrollment => {
        if (enrollment.status === 'active' && enrollment.modalities?.name) {
          const modalityName = enrollment.modalities.name;
          modalityCount.set(modalityName, (modalityCount.get(modalityName) || 0) + 1);
        }
      });

      const studentsByModalityData = Array.from(modalityCount.entries())
        .map(([name, students], index) => ({
          name,
          students: students as number,
          color: colors[index % colors.length]
        }));

      setStudentsByModality(studentsByModalityData);

      // Generate mock monthly revenue data (last 6 months)
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const mockMonthlyData = months.map((month, index) => ({
        month,
        revenue: monthlyRevenue * (0.8 + Math.random() * 0.4), // Simulate variation
        expenses: monthlyRevenue * (0.3 + Math.random() * 0.2) // Simulate expenses
      }));

      setMonthlyRevenue(mockMonthlyData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    studentsByModality,
    monthlyRevenue,
    isLoading,
    refetch: fetchDashboardData
  };
};
