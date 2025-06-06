
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useEquipamentos } from "@/hooks/useEquipamentos";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { useMemo } from "react";

const Relatorios = () => {
  const { data: equipamentos } = useEquipamentos();
  const { data: movimentacoes } = useMovimentacoes();

  const equipamentosMaisUsados = useMemo(() => {
    if (!movimentacoes) return [];
    
    const contagemUsos = movimentacoes
      .filter(mov => mov.tipo === 'Retirada')
      .reduce((acc: Record<string, number>, mov) => {
        const nome = mov.equipamentos?.nome || 'Desconhecido';
        const currentCount: number = acc[nome] || 0;
        acc[nome] = currentCount + 1;
        return acc;
      }, {});

    return Object.entries(contagemUsos)
      .map(([nome, usos]) => ({ nome, usos }))
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 5);
  }, [movimentacoes]);

  const estatisticas = [
    {
      titulo: "Total de Equipamentos",
      valor: (equipamentos?.length || 0).toString(),
      icone: Calendar,
      cor: "text-blue-600"
    },
    {
      titulo: "Em Uso Atualmente",
      valor: (equipamentos?.filter(eq => eq.status === 'Em uso').length || 0).toString(),
      icone: TrendingUp,
      cor: "text-green-600"
    },
    {
      titulo: "Movimentações Totais",
      valor: (movimentacoes?.length || 0).toString(),
      icone: Clock,
      cor: "text-orange-600"
    },
    {
      titulo: "Em Manutenção",
      valor: (equipamentos?.filter(eq => eq.status === 'Manutenção').length || 0).toString(),
      icone: AlertTriangle,
      cor: "text-red-600"
    }
  ];

  const equipamentosEmUso = equipamentos?.filter(eq => eq.status === 'Em uso') || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise de uso e performance dos equipamentos
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {estatisticas.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.titulo}
                    </p>
                    <p className="text-2xl font-bold">{stat.valor}</p>
                  </div>
                  <stat.icone className={`h-8 w-8 ${stat.cor}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de Equipamentos Mais Usados */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Mais Utilizados</CardTitle>
            <CardDescription>
              Ranking dos equipamentos com maior número de retiradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {equipamentosMaisUsados.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={equipamentosMaisUsados}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nome" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum dado de movimentação disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipamentos em Uso */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos em Uso</CardTitle>
            <CardDescription>
              Equipamentos atualmente retirados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipamentosEmUso.length > 0 ? (
                equipamentosEmUso.map((equipamento) => (
                  <div key={equipamento.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{equipamento.nome}</p>
                      <p className="text-sm text-muted-foreground">Código: {equipamento.codigo}</p>
                      {equipamento.usuario_atual && (
                        <p className="text-sm text-muted-foreground">Com: {equipamento.usuario_atual}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-600 font-medium">Em uso</p>
                      <p className="text-sm text-muted-foreground">
                        Atualizado: {new Date(equipamento.atualizado_em).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum equipamento em uso no momento
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Relatorios;
