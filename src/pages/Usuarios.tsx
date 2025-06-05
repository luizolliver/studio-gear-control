
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Usuarios = () => {
  // Mock data - será substituído pela integração com Supabase
  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      telefone: "11987654321",
      funcao: "admin",
      ativo: true,
      criado_em: "2024-01-15"
    },
    {
      id: 2,
      nome: "Maria Santos",
      telefone: "11876543210",
      funcao: "funcionario",
      ativo: true,
      criado_em: "2024-02-20"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      telefone: "11765432109",
      funcao: "funcionario",
      ativo: false,
      criado_em: "2024-03-10"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie colaboradores e seus níveis de acesso
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
            <CardDescription>
              Lista de todos os colaboradores do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
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
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Usuarios;
