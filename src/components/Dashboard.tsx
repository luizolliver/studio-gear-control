
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ArrowRight, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEquipamentos } from "@/hooks/useEquipamentos";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";

export function Dashboard() {
  const { data: equipamentos } = useEquipamentos();
  const { data: movimentacoes } = useMovimentacoes();

  const stats = {
    totalEquipamentos: equipamentos?.length || 0,
    equipamentosDisponiveis: equipamentos?.filter(eq => eq.status === 'Disponível').length || 0,
    equipamentosEmUso: equipamentos?.filter(eq => eq.status === 'Em uso').length || 0,
    equipamentosManutencao: equipamentos?.filter(eq => eq.status === 'Manutenção').length || 0,
    movimentacoesMes: movimentacoes?.length || 0
  };

  const equipamentosRecentes = equipamentos?.slice(0, 4) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'bg-green-100 text-green-800 border-green-200';
      case 'Em uso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Manutenção': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-blue-100">Visão geral do sistema de controle de equipamentos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipamentos}</div>
            <p className="text-xs text-muted-foreground">
              Equipamentos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.equipamentosDisponiveis}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEquipamentos > 0 ? Math.round((stats.equipamentosDisponiveis / stats.totalEquipamentos) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Uso</CardTitle>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.equipamentosEmUso}</div>
            <p className="text-xs text-muted-foreground">
              Por usuários
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.equipamentosManutencao}</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipamentos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Equipamentos
            </CardTitle>
            <CardDescription>
              Últimos equipamentos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipamentosRecentes.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{item.nome}</p>
                    <p className="text-xs text-muted-foreground">Código: {item.codigo}</p>
                    {item.usuario_atual && (
                      <p className="text-xs text-muted-foreground">Por: {item.usuario_atual}</p>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Operações frequentes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors text-left">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Check-out Rápido</p>
                  <p className="text-xs text-muted-foreground">Retirar equipamento</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors text-left">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Cadastrar Equipamento</p>
                  <p className="text-xs text-muted-foreground">Adicionar novo item</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors text-left">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Gerenciar Usuários</p>
                  <p className="text-xs text-muted-foreground">Controle de acesso</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
