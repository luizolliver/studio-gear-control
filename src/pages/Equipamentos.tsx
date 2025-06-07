import { Layout } from "@/components/Layout";
import { AdminProtected } from "@/components/AdminProtected";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, Edit, Trash2, Loader2, QrCode } from "lucide-react";
import { useEquipamentos } from "@/hooks/useEquipamentos";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useState } from "react";
import { EquipamentoModal } from "@/components/EquipamentoModal";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Equipamento } from "@/lib/supabase";

export default function Equipamentos() {
  const { data: equipamentos, isLoading, error } = useEquipamentos();
  const { isAdmin } = useAdminCheck();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | null>(null);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'bg-green-100 text-green-800 border-green-200';
      case 'Em uso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Manutenção': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEquipamentos = equipamentos?.filter(equipamento => {
    const matchesSearch = equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipamento.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || equipamento.categoria.toLowerCase() === categoryFilter;
    const matchesStatus = !statusFilter || equipamento.status.toLowerCase().replace(' ', '') === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const handleNewEquipamento = () => {
    if (!isAdmin) return;
    setSelectedEquipamento(null);
    setIsModalOpen(true);
  };

  const handleEditEquipamento = (equipamento: Equipamento) => {
    if (!isAdmin) return;
    setSelectedEquipamento(equipamento);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipamento(null);
  };

  const handleShowQRCode = (codigo: string) => {
    setShowQRCode(codigo);
  };

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Erro ao carregar equipamentos</p>
            <p className="text-sm text-muted-foreground">Verifique a conexão com o Supabase</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Equipamentos</h1>
            <p className="text-muted-foreground">Gerencie todos os equipamentos da produtora</p>
          </div>
          {isAdmin && (
            <Button className="flex items-center gap-2" onClick={handleNewEquipamento}>
              <Plus className="h-4 w-4" />
              Novo Equipamento
            </Button>
          )}
        </div>

        {/* QR Code Display */}
        {showQRCode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                QR Code do Equipamento
                <Button variant="outline" size="sm" onClick={() => setShowQRCode(null)}>
                  Fechar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <QRCodeGenerator 
                  value={showQRCode} 
                  title={`Equipamento: ${showQRCode}`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por nome ou código..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select 
                className="px-3 py-2 border rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                <option value="câmera">Câmera</option>
                <option value="lente">Lente</option>
                <option value="microfone">Microfone</option>
                <option value="suporte">Suporte</option>
                <option value="iluminação">Iluminação</option>
                <option value="acessório">Acessório</option>
              </select>
              <select 
                className="px-3 py-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="disponível">Disponível</option>
                <option value="emuso">Em uso</option>
                <option value="manutenção">Manutenção</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {/* Equipment List */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipamentos.map((equipamento) => (
              <Card key={equipamento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{equipamento.nome}</CardTitle>
                        <CardDescription>Código: {equipamento.codigo}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Categoria:</span>
                    <Badge variant="outline">{equipamento.categoria}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={getStatusColor(equipamento.status)}>
                      {equipamento.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Localização:</span>
                    <span className="text-sm font-medium">{equipamento.localizacao}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {isAdmin && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditEquipamento(equipamento)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShowQRCode(equipamento.codigo)}
                    >
                      <QrCode className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredEquipamentos.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum equipamento encontrado</h3>
            <p className="text-muted-foreground">
              {equipamentos?.length === 0 ? 'Comece adicionando seu primeiro equipamento.' : 'Tente ajustar os filtros de busca.'}
            </p>
          </div>
        )}

        {/* Modal de Equipamento - apenas para admin */}
        {isAdmin && (
          <EquipamentoModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            equipamento={selectedEquipamento}
          />
        )}
      </div>
    </Layout>
  );
}
