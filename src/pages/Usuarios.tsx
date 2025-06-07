import { useState } from "react";
import { Layout } from "@/components/Layout";
import { AdminProtected } from "@/components/AdminProtected";
import { UsuarioModal } from "@/components/UsuarioModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react";
import { useUsuarios, useDeleteUsuario } from "@/hooks/useUsuarios";
import { useToast } from "@/hooks/use-toast";
import { Usuario } from "@/lib/supabase";

const Usuarios = () => {
  const { data: usuarios, isLoading, error } = useUsuarios();
  const deleteUsuario = useDeleteUsuario();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  const handleNewUsuario = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDeleteUsuario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      await deleteUsuario.mutateAsync(id);
      toast({
        title: 'Usuário excluído',
        description: 'Usuário foi removido com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir usuário. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  if (error) {
    return (
      <Layout>
        <AdminProtected>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-2">Erro ao carregar usuários</p>
              <p className="text-sm text-muted-foreground">Verifique a conexão com o Supabase</p>
            </div>
          </div>
        </AdminProtected>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminProtected>
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
              <p className="text-muted-foreground">
                Gerencie colaboradores e seus níveis de acesso
              </p>
            </div>
            <Button onClick={handleNewUsuario}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários Cadastrados
              </CardTitle>
              <CardDescription>
                Lista de todos os colaboradores do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : usuarios && usuarios.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.telefone}</TableCell>
                        <TableCell>
                          <Badge variant={usuario.funcao === 'admin' ? 'default' : 'secondary'}>
                            {usuario.funcao === 'admin' ? 'Administrador' : 'Funcionário'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={usuario.ativo ? 'default' : 'destructive'}>
                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(usuario.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditUsuario(usuario)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUsuario(usuario.id)}
                              disabled={deleteUsuario.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
                  <p className="text-muted-foreground">
                    Comece adicionando o primeiro usuário.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <UsuarioModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            usuario={selectedUsuario}
          />
        </div>
      </AdminProtected>
    </Layout>
  );
};

export default Usuarios;
