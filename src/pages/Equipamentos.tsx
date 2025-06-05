
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, Edit, Trash2 } from "lucide-react";

export default function Equipamentos() {
  // Mock data - substituir por dados reais do Supabase
  const equipamentos = [
    { id: 1, nome: "Câmera Sony FX6", codigo: "CAM001", categoria: "Câmera", status: "Disponível", localizacao: "Estoque" },
    { id: 2, nome: "Lente Canon 24-70mm", codigo: "LEN003", categoria: "Lente", status: "Em uso", localizacao: "João Silva" },
    { id: 3, nome: "Microfone Rode NTG4+", codigo: "MIC005", categoria: "Microfone", status: "Manutenção", localizacao: "Oficina" },
    { id: 4, nome: "Tripé Manfrotto", codigo: "TRI001", categoria: "Suporte", status: "Disponível", localizacao: "Estoque" },
    { id: 5, nome: "Câmera Canon EOS R5", codigo: "CAM002", categoria: "Câmera", status: "Em uso", localizacao: "Maria Santos" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'bg-green-100 text-green-800 border-green-200';
      case 'Em uso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Manutenção': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Equipamentos</h1>
            <p className="text-muted-foreground">Gerencie todos os equipamentos da produtora</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Equipamento
          </Button>
        </div>

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
                  <Input placeholder="Buscar por nome ou código..." className="pl-10" />
                </div>
              </div>
              <select className="px-3 py-2 border rounded-md">
                <option value="">Todas as categorias</option>
                <option value="camera">Câmera</option>
                <option value="lente">Lente</option>
                <option value="microfone">Microfone</option>
                <option value="suporte">Suporte</option>
              </select>
              <select className="px-3 py-2 border rounded-md">
                <option value="">Todos os status</option>
                <option value="disponivel">Disponível</option>
                <option value="emuso">Em uso</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Equipment List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipamentos.map((equipamento) => (
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
