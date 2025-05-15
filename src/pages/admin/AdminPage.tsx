
import React, { useState, useEffect } from "react";
import { Settings, UserPlus, Search, Shield, Clock, Trash2, Edit, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

// Interfaces para tipagem
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "secretary" | "financial" | "teacher";
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: string;
}

// Mock users para demonstração
const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin Principal",
    email: "admin@escola.com",
    password: "senha123",
    role: "admin",
    isActive: true,
    createdAt: "2023-01-01T10:00:00Z",
    lastLogin: "2024-05-12T08:45:00Z"
  },
  {
    id: "2",
    name: "Maria Secretária",
    email: "maria@escola.com",
    password: "senha456",
    role: "secretary",
    isActive: true,
    createdAt: "2023-02-15T10:00:00Z",
    lastLogin: "2024-05-10T14:30:00Z"
  },
  {
    id: "3",
    name: "João Financeiro",
    email: "joao@escola.com",
    password: "senha789",
    role: "financial",
    isActive: true,
    createdAt: "2023-03-20T10:00:00Z",
    lastLogin: "2024-05-11T16:15:00Z"
  },
  {
    id: "4",
    name: "Ana Professora",
    email: "ana@escola.com",
    password: "senha321",
    role: "teacher",
    isActive: false,
    createdAt: "2023-04-10T10:00:00Z",
    lastLogin: "2024-04-28T09:20:00Z"
  }
];

// Mock logs para demonstração
const initialLogs: LogEntry[] = [
  {
    id: "1",
    userId: "1",
    userName: "Admin Principal",
    action: "create",
    resource: "user",
    timestamp: "2024-05-12T08:45:00Z",
    details: "Criou usuário Maria Secretária"
  },
  {
    id: "2",
    userId: "2",
    userName: "Maria Secretária",
    action: "update",
    resource: "student",
    timestamp: "2024-05-11T14:30:00Z",
    details: "Atualizou dados do aluno João Silva"
  },
  {
    id: "3",
    userId: "3",
    userName: "João Financeiro",
    action: "create",
    resource: "payment",
    timestamp: "2024-05-11T16:15:00Z",
    details: "Registrou pagamento de mensalidade"
  },
  {
    id: "4",
    userId: "1",
    userName: "Admin Principal",
    action: "delete",
    resource: "class",
    timestamp: "2024-05-10T10:20:00Z",
    details: "Removeu turma de Ballet Infantil"
  },
  {
    id: "5",
    userId: "4",
    userName: "Ana Professora",
    action: "update",
    resource: "attendance",
    timestamp: "2024-05-09T15:00:00Z",
    details: "Registrou presença dos alunos"
  }
];

// Schema para validação de usuário
const userSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["admin", "secretary", "financial", "teacher"], {
    required_error: "Selecione um perfil",
  }),
  isActive: z.boolean().default(true),
});

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "secretary",
      isActive: true,
    },
  });

  // Filtra usuários com base no termo de busca
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtra logs com base no termo de busca
  const filteredLogs = logs.filter((log) =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reseta o formulário quando o modal é aberto para criar um novo usuário
  const handleAddUser = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "secretary",
      isActive: true,
    });
    setUserToEdit(null);
    setOpenUserForm(true);
  };

  // Preenche o formulário com os dados do usuário para edição
  const handleEditUser = (user: User) => {
    form.reset({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
    });
    setUserToEdit(user);
    setOpenUserForm(true);
  };

  // Confirma exclusão de usuário
  const handleDeleteConfirm = (id: string) => {
    setUserIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Exclui o usuário
  const handleDeleteUser = () => {
    if (userIdToDelete) {
      setUsers(users.filter((user) => user.id !== userIdToDelete));
      
      // Adicionar log da ação
      const newLog: LogEntry = {
        id: Date.now().toString(),
        userId: "1", // assumindo que é o admin atual
        userName: "Admin Principal",
        action: "delete",
        resource: "user",
        timestamp: new Date().toISOString(),
        details: `Removeu usuário ${users.find(u => u.id === userIdToDelete)?.name}`
      };
      
      setLogs([newLog, ...logs]);
      toast.success("Usuário removido com sucesso!");
      setDeleteConfirmOpen(false);
      setUserIdToDelete(null);
    }
  };

  // Alterna o status ativo/inativo do usuário
  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
    
    const targetUser = users.find((user) => user.id === id);
    const newStatus = targetUser?.isActive ? "inativo" : "ativo";
    
    // Adicionar log da ação
    const newLog: LogEntry = {
      id: Date.now().toString(),
      userId: "1", // assumindo que é o admin atual
      userName: "Admin Principal",
      action: "update",
      resource: "user",
      timestamp: new Date().toISOString(),
      details: `Alterou status de ${targetUser?.name} para ${newStatus}`
    };
    
    setLogs([newLog, ...logs]);
    toast.success(`Status do usuário alterado para ${newStatus}!`);
  };

  // Submete o formulário para criar/editar usuário
  const onSubmit = (data: z.infer<typeof userSchema>) => {
    if (userToEdit) {
      // Edita usuário existente
      setUsers(
        users.map((user) =>
          user.id === userToEdit.id ? { ...user, ...data } : user
        )
      );
      
      // Adicionar log da ação
      const newLog: LogEntry = {
        id: Date.now().toString(),
        userId: "1", // assumindo que é o admin atual
        userName: "Admin Principal",
        action: "update",
        resource: "user",
        timestamp: new Date().toISOString(),
        details: `Atualizou dados do usuário ${data.name}`
      };
      
      setLogs([newLog, ...logs]);
      toast.success("Usuário atualizado com sucesso!");
    } else {
      // Cria novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      
      setUsers([...users, newUser]);
      
      // Adicionar log da ação
      const newLog: LogEntry = {
        id: Date.now().toString(),
        userId: "1", // assumindo que é o admin atual
        userName: "Admin Principal",
        action: "create",
        resource: "user",
        timestamp: new Date().toISOString(),
        details: `Criou usuário ${data.name}`
      };
      
      setLogs([newLog, ...logs]);
      toast.success("Usuário criado com sucesso!");
    }
    
    setOpenUserForm(false);
  };

  // Função para traduzir o tipo de perfil para português
  const translateRole = (role: string) => {
    const roles: Record<string, string> = {
      admin: "Administrador",
      secretary: "Secretaria",
      financial: "Financeiro",
      teacher: "Professor",
    };
    
    return roles[role] || role;
  };

  // Função para traduzir o tipo de ação para português
  const translateAction = (action: string) => {
    const actions: Record<string, string> = {
      create: "Criação",
      update: "Atualização",
      delete: "Exclusão",
      login: "Login",
      logout: "Logout",
    };
    
    return actions[action] || action;
  };

  // Função para traduzir o tipo de recurso para português
  const translateResource = (resource: string) => {
    const resources: Record<string, string> = {
      user: "Usuário",
      student: "Aluno",
      payment: "Pagamento",
      class: "Turma",
      attendance: "Presença",
    };
    
    return resources[resource] || resource;
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Administração"
        subtitle="Gerencie usuários e acesso ao sistema"
        icon={Settings}
      >
        <Button
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={handleAddUser}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </PageTitle>

      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
            </TabsList>
          </div>

          <div className="mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Buscar ${activeTab === "users" ? "usuários" : "logs"}...`}
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead>Último acesso</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            Nenhum usuário encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  user.role === "admin" && "border-purple-500 bg-purple-500/10 text-purple-700",
                                  user.role === "secretary" && "border-blue-500 bg-blue-500/10 text-blue-700",
                                  user.role === "financial" && "border-green-500 bg-green-500/10 text-green-700",
                                  user.role === "teacher" && "border-orange-500 bg-orange-500/10 text-orange-700"
                                )}
                              >
                                {translateRole(user.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  user.isActive
                                    ? "border-green-500 bg-green-500/10 text-green-700"
                                    : "border-red-500 bg-red-500/10 text-red-700"
                                }
                              >
                                {user.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.createdAt ? formatDate(user.createdAt) : "-"}
                            </TableCell>
                            <TableCell>
                              {user.lastLogin ? formatDate(user.lastLogin) : "-"}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <Edit className="h-4 w-4 mr-2" /> Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                    {user.isActive ? (
                                      <>
                                        <XCircle className="h-4 w-4 mr-2 text-red-500" /> Desativar
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Ativar
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteConfirm(user.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Recurso</TableHead>
                        <TableHead>Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Nenhum log encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{formatDate(log.timestamp)}</TableCell>
                            <TableCell>{log.userName}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  log.action === "create" && "border-green-500 bg-green-500/10 text-green-700",
                                  log.action === "update" && "border-blue-500 bg-blue-500/10 text-blue-700",
                                  log.action === "delete" && "border-red-500 bg-red-500/10 text-red-700",
                                  log.action === "login" && "border-purple-500 bg-purple-500/10 text-purple-700",
                                  log.action === "logout" && "border-orange-500 bg-orange-500/10 text-orange-700"
                                )}
                              >
                                {translateAction(log.action)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {translateResource(log.resource)}
                              </Badge>
                            </TableCell>
                            <TableCell>{log.details || "-"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Formulário de Usuário */}
      <Dialog open={openUserForm} onOpenChange={setOpenUserForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {userToEdit ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {userToEdit
                ? "Edite as informações do usuário"
                : "Preencha os dados para criar um novo usuário"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email do usuário" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="Senha do usuário" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="secretary">Secretaria</SelectItem>
                        <SelectItem value="financial">Financeiro</SelectItem>
                        <SelectItem value="teacher">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Usuário ativo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenUserForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-dance-primary hover:bg-dance-secondary">
                  {userToEdit ? "Salvar Alterações" : "Criar Usuário"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
