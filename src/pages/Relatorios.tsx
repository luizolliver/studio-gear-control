
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Clock, AlertTriangle } from "lucide-react";

const Relatorios = () => {
  // Mock data - será substituído pela integração com Supabase
  const equipamentosMaisUsados = [
    { nome: "Câmera Sony A7III", usos: 45 },
    { nome: "Lente 24-70mm", usos: 38 },
    { nome: "Microfone Shotgun", usos: 32 },
    { nome: "Tripé Manfrotto", usos: 28 },
    { nome: "Monitor Atomos", usos: 22 }
  ];

  const estatisticas = [
    {
      titulo: "Total de Equipamentos",
      valor: "124",
      icone: Calendar,
      cor: "text-blue-600"
    },
    {
      titulo: "Em Uso Atualmente",
      valor: "23",
      icone: TrendingUp,
      cor: "text-green-600"
    },
    {
      titulo: "Tempo Médio de Uso",
      valor: "4.5h",
      icone: Clock,
      cor: "text-orange-600"
    },
    {
      titulo: "Em Atraso",
      valor: "3",
      icone: AlertTriangle,
      cor: "text-red-600"
    }
  ];

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
          </CardContent>
        </Card>

        {/* Equipamentos em Atraso */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos em Atraso</CardTitle>
            <CardDescription>
              Equipamentos que deveriam ter sido devolvidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Câmera Canon EOS R5</p>
                  <p className="text-sm text-muted-foreground">Com: João Silva</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-medium">3 dias em atraso</p>
                  <p className="text-sm text-muted-foreground">Retirada: 15/12/2024</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Microfone Sennheiser</p>
                  <p className="text-sm text-muted-foreground">Com: Maria Santos</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-medium">1 dia em atraso</p>
                  <p className="text-sm text-muted-foreground">Retirada: 17/12/2024</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Lente 85mm f/1.4</p>
                  <p className="text-sm text-muted-foreground">Com: Pedro Costa</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-medium">5 dias em atraso</p>
                  <p className="text-sm text-muted-foreground">Retirada: 13/12/2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Relatorios;
