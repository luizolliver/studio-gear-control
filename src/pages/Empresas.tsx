
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { MasterAdminProtected } from "@/components/MasterAdminProtected";
import { EmpresaModal } from "@/components/EmpresaModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Building2 } from "lucide-react";
import { useEmpresas, useDeleteEmpresa } from "@/hooks/useEmpresas";
import { useToast } from "@/hooks/use-toast";
import { Empresa } from "@/lib/supabase";

const Empresas = () => {
  const { data: empresas, isLoading, error } = useEmpresas();
  const deleteEmpresa = useDeleteEmpresa();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const handleNewEmpresa = () => {
    setSelectedEmpresa(null);
    setIsModalOpen(true);
  };

  const handleEditEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setIsModalOpen(true);
  };

  const handleDeleteEmpresa = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
    
    try {
      await deleteEmpresa.mutateAsync(id);
      toast({
        title: 'Empresa excluída',
        description: 'Empresa foi removida com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir empresa. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmpresa(null);
  };

  if (error) {
    return (
      <Layout>
        <MasterAdminProtected>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-2">Erro ao carregar empresas</p>
              <p className="text-sm text-muted-foreground">Verifique a conexão com o Supabase</p>
            </div>
          </div>
        </MasterAdminProtected>
      </Layout>
    );
  }

  return (
    <Layout>
      <MasterAdminProtected>
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Empresas</h1>
              <p className="text-muted-foreground">
                Painel Master - Gerencie todas as empresas do sistema
              </p>
            </div>
            <Button onClick={handleNewEmpresa}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Empresas Cadastradas
              </CardTitle>
              <CardDescription>
                Lista de todas as empresas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : empresas && empresas.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empresas.map((empresa) => (
                      <TableRow key={empresa.id}>
                        <TableCell className="font-medium">{empresa.nome}</TableCell>
                        <TableCell>{empresa.cnpj || '-'}</TableCell>
                        <TableCell>{empresa.email || '-'}</TableCell>
                        <TableCell>{empresa.telefone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={empresa.ativo ? 'default' : 'destructive'}>
                            {empresa.ativo ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(empresa.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditEmpresa(empresa)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteEmpresa(empresa.id)}
                              disabled={deleteEmpresa.isPending}
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
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma empresa encontrada</h3>
                  <p className="text-muted-foreground">
                    Comece adicionando a primeira empresa.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <EmpresaModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            empresa={selectedEmpresa}
          />
        </div>
      </MasterAdminProtected>
    </Layout>
  );
};

export default Empresas;
