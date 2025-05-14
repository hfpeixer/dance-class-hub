
import React, { useState } from "react";
import { Users, Settings, FileText, Plus, Edit, Trash2, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

// Esquema para formulário de usuário
const userFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["admin", "teacher", "secretary", "financial"]),
  isActive: z.boolean().default(true),
});

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "secretary" | "financial";
  isActive: boolean;
  lastLogin?: string;
}

interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details?: string;
  ip?: string;
  timestamp: string;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Estados para os dados
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("danceSchool_users");
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      {
        id: "1",
        name: "Admin Principal",
        email: "admin@danceschool.com",
        role: "admin",
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Maria Oliveira",
        email: "maria@danceschool.com",
        role: "teacher",
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      {
        id: "3",
        name: "João Silva",
        email: "joao@danceschool.com",
        role: "secretary",
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Ana Santos",
        email: "ana@danceschool.com",
        role: "financial",
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
    ];
  });
  
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const savedLogs = localStorage.getItem("danceSchool_logs");
    if (savedLogs) {
      return JSON.parse(savedLogs);
    }
    // Gerar logs de exemplo
    return Array.from({ length: 20 }).map((_, index) => ({
      id: `log-${index + 1}`,
      userId: index % 4 === 0 ? "4" : index % 3 === 0 ? "3" : index % 2 === 0 ? "2" : "1",
      userName: index % 4 === 0 ? "Ana Santos" : index % 3 === 0 ? "João Silva" : index % 2 === 0 ? "Maria Oliveira" : "Admin Principal",
      action: index % 3 === 0 ? "update" : index % 2 === 0 ? "create" : "view",
      resource: ["students", "payments", "classes", "teachers", "settings"][index % 5],
      details: `${index % 3 === 0 ? "Atualizou" : index % 2 === 0 ? "Criou" : "Visualizou"} registro #${index + 100}`,
      ip: `192.168.1.${index % 255}`,
      timestamp: new Date(Date.now() - index * 3600000).toISOString(),
    }));
  });

  // Salvar no localStorage quando os dados mudarem
  React.useEffect(() => {
    localStorage.setItem("danceSchool_users", JSON.stringify(users));
  }, [users]);

  React.useEffect(() => {
    localStorage.setItem("danceSchool_logs", JSON.stringify(logs));
  }, [logs]);

  // Formulário para usuário
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "teacher",
      isActive: true,
    },
  });

  // Handlers
  const handleNewUser = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "teacher",
      isActive: true,
    });
    setUserToEdit(null);
    setOpenUserDialog(true);
  };

  const handleEditUser = (user: User) => {
    form.reset({
      name: user.name,
      email: user.email,
      password: "", // Não preenchemos a senha ao editar
      role: user.role,
      isActive: user.isActive,
    });
    setUserToEdit(user);
    setOpenUserDialog(true);
  };

  const confirmDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      // Adiciona um log de exclusão
      addLogEntry({
        userId: "1", // Assumindo que é o admin excluindo
        userName: "Admin Principal",
        action: "delete",
        resource: "users",
        details: `Usuário excluído: ${users.find(u => u.id === userToDelete)?.name}`,
      });
      
      setUsers(users.filter(user => user.id !== userToDelete));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      toast.success("Usuário excluído com sucesso!");
    }
  };

  const onSubmitUser = (values: z.infer<typeof userFormSchema>) => {
    if (userToEdit) {
      // Atualizar usuário existente
      setUsers(users.map(user => 
        user.id === userToEdit.id
          ? { ...user, ...values }
          : user
      ));
      
      // Adiciona log de atualização
      addLogEntry({
        userId: "1", // Assumindo que é o admin atualizando
        userName: "Admin Principal",
        action: "update",
        resource: "users",
        details: `Usuário atualizado: ${values.name}`,
      });
      
      toast.success("Usuário atualizado com sucesso!");
    } else {
      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        ...values,
      };
      
      setUsers([...users, newUser]);
      
      // Adiciona log de criação
      addLogEntry({
        userId: "1", // Assumindo que é o admin criando
        userName: "Admin Principal",
        action: "create",
        resource: "users",
        details: `Novo usuário criado: ${values.name}`,
      });
      
      toast.success("Usuário criado com sucesso!");
    }
    
    setOpenUserDialog(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId
        ? { ...user, isActive: !user.isActive }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user ? !user.isActive : false;
    
    // Adiciona log de alteração de status
    addLogEntry({
      userId: "1", // Assumindo que é o admin alterando
      userName: "Admin Principal",
      action: "update",
      resource: "users",
      details: `Status do usuário ${user?.name} alterado para ${newStatus ? 'Ativo' : 'Inativo'}`,
    });
    
    toast.success(`Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso!`);
  };

  // Função para adicionar entradas no log
  const addLogEntry = (data: Omit<LogEntry, "id" | "timestamp">) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ip: "127.0.0.1", // Simulando IP local
      ...data,
    };
    
    setLogs([newLog, ...logs]);
  };

  // Helper para formatação do log
  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return <Badge className="bg-green-500">Criar</Badge>;
      case "update":
        return <Badge className="bg-blue-500">Atualizar</Badge>;
      case "delete":
        return <Badge className="bg-red-500">Excluir</Badge>;
      default:
        return <Badge variant="outline">Visualizar</Badge>;
    }
  };

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Administrador</Badge>;
      case "teacher":
        return <Badge className="bg-blue-500">Professor</Badge>;
      case "secretary":
        return <Badge className="bg-green-500">Secretaria</Badge>;
      case "financial":
        return <Badge className="bg-amber-500">Financeiro</Badge>;
      default:
        return <Badge variant="outline">Usuário</Badge>;
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Administração"
        subtitle="Gerencie usuários, permissões e logs do sistema"
        icon={Settings}
      />

      <div className="mb-6">
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              {activeTab === "users" && (
                <Button 
                  className="bg-dance-primary hover:bg-dance-secondary"
                  onClick={handleNewUser}
                >
                  <Plus className="mr-2 h-4 w-4" /> Novo Usuário
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-dance-primary/10 text-dance-primary">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {getUserRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            <span>{user.isActive ? "Ativo" : "Inativo"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : "Nunca"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.isActive ? (
                                <EyeOff className="h-4 w-4 text-amber-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            {user.id !== "1" && ( // Não permitir excluir o admin principal
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => confirmDeleteUser(user.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Logs do Sistema</CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCcw className="h-4 w-4 mr-1" /> Atualizar
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-b border-border p-4 flex gap-2">
                  <Input placeholder="Filtrar logs..." className="max-w-sm" />
                  <Button variant="outline">Filtrar</Button>
                  <Button variant="outline"><FileText className="h-4 w-4 mr-1" /> Exportar</Button>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Timestamp</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Recurso</TableHead>
                        <TableHead>Detalhes</TableHead>
                        <TableHead>IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>{log.userName}</TableCell>
                          <TableCell>
                            {getActionBadge(log.action)}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">{log.resource}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm truncate max-w-xs inline-block">
                              {log.details}
                            </span>
                          </TableCell>
                          <TableCell>{log.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Gerencie as configurações globais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Geral</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Modo de manutenção</p>
                      <p className="text-sm text-muted-foreground">
                        Ativar modo de manutenção para todos os usuários
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">E-mails de notificação</p>
                      <p className="text-sm text-muted-foreground">
                        Enviar e-mails automáticos de mensalidades e lembretes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Segurança</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticação de dois fatores</p>
                      <p className="text-sm text-muted-foreground">
                        Exigir 2FA para todos os usuários administradores
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Logs detalhados</p>
                      <p className="text-sm text-muted-foreground">
                        Registrar todas as ações realizadas no sistema
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Tempo de sessão</p>
                      <p className="text-sm text-muted-foreground">
                        Tempo em minutos até que a sessão expire
                      </p>
                    </div>
                    <Input
                      type="number"
                      placeholder="60"
                      className="w-20 text-right"
                      defaultValue="60"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">
                  Cancelar
                </Button>
                <Button className="bg-dance-primary hover:bg-dance-secondary">
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de usuário */}
      <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {userToEdit ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {userToEdit
                ? "Edite as informações do usuário. Deixe a senha em branco para manter a atual."
                : "Preencha as informações para criar um novo usuário."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>Senha {userToEdit && "(deixe em branco para manter)"}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
                    <FormLabel>Função</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="teacher">Professor</SelectItem>
                        <SelectItem value="secretary">Secretaria</SelectItem>
                        <SelectItem value="financial">Financeiro</SelectItem>
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Usuário Ativo</FormLabel>
                      <FormDescription>
                        Usuários inativos não podem fazer login no sistema
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenUserDialog(false)}>
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

      {/* Diálogo de confirmação de exclusão */}
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
