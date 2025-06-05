
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/context/AuthContext";

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export interface LogEntry {
  id: string;
  user_id: string | null;
  action: string;
  resource: string;
  resource_id: string | null;
  details: string | null;
  created_at: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_management_data');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    }
  };

  // Fetch system logs
  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select(`
          *,
          profiles!system_logs_user_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      const transformedLogs = data?.map((log: any) => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        resource: log.resource,
        resource_id: log.resource_id,
        details: log.details,
        created_at: log.created_at,
        userName: log.profiles?.name || 'Usuário desconhecido'
      })) || [];
      
      setLogs(transformedLogs);
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      toast.error("Erro ao carregar logs");
    }
  };

  // Create a new user
  const createUser = async (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: userData.email,
            name: userData.name
          });

        if (profileError) throw profileError;

        // Assign role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: userData.role
          });

        if (roleError) throw roleError;

        // Log the action
        await supabase.rpc('log_user_action', {
          _action: 'create',
          _resource: 'user',
          _resource_id: authData.user.id,
          _details: `Criou usuário ${userData.name} com perfil ${userData.role}`
        });

        toast.success("Usuário criado com sucesso!");
        await fetchUsers();
        await fetchLogs();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Erro ao criar usuário");
      throw error;
    }
  };

  // Update user
  const updateUser = async (userId: string, userData: {
    name: string;
    email: string;
    role: UserRole;
  }) => {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update auth user email if changed
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        email: userData.email,
        user_metadata: {
          name: userData.name
        }
      });

      if (authError) throw authError;

      // Update role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: userData.role
        });

      if (roleError) throw roleError;

      // Log the action
      await supabase.rpc('log_user_action', {
        _action: 'update',
        _resource: 'user',
        _resource_id: userId,
        _details: `Atualizou dados do usuário ${userData.name}`
      });

      toast.success("Usuário atualizado com sucesso!");
      await fetchUsers();
      await fetchLogs();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Erro ao atualizar usuário");
      throw error;
    }
  };

  // Delete user
  const deleteUser = async (userId: string, userName: string) => {
    try {
      // Delete auth user (this will cascade to profiles and user_roles)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_user_action', {
        _action: 'delete',
        _resource: 'user',
        _resource_id: userId,
        _details: `Removeu usuário ${userName}`
      });

      toast.success("Usuário removido com sucesso!");
      await fetchUsers();
      await fetchLogs();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Erro ao remover usuário");
      throw error;
    }
  };

  // Toggle user status (simulate activation/deactivation by updating metadata)
  const toggleUserStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          is_active: !currentStatus
        }
      });

      if (error) throw error;

      const newStatus = !currentStatus ? "ativo" : "inativo";
      
      // Log the action
      await supabase.rpc('log_user_action', {
        _action: 'update',
        _resource: 'user',
        _resource_id: userId,
        _details: `Alterou status de ${userName} para ${newStatus}`
      });

      toast.success(`Status do usuário alterado para ${newStatus}!`);
      await fetchUsers();
      await fetchLogs();
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      toast.error(error.message || "Erro ao alterar status do usuário");
      throw error;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchLogs()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    users,
    logs,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refetchData: async () => {
      await Promise.all([fetchUsers(), fetchLogs()]);
    }
  };
};
