
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { QrCode, Search, ArrowRight, ArrowLeft, Clock, User } from "lucide-react";
import { useState } from "react";

export default function CheckIn() {
  const [searchCode, setSearchCode] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [action, setAction] = useState<"checkout" | "checkin" | null>(null);

  // Mock data - substituir por dados reais do Supabase
  const recentMovements = [
    { id: 1, equipamento: "Câmera Sony FX6", codigo: "CAM001", tipo: "Retirada", usuario: "João Silva", data: "2024-01-15 14:30", observacoes: "Gravação externa" },
    { id: 2, equipamento: "Tripé Manfrotto", codigo: "TRI001", tipo: "Devolução", usuario: "Maria Santos", data: "2024-01-15 12:15", observacoes: "" },
    { id: 3, equipamento: "Microfone Rode", codigo: "MIC005", tipo: "Retirada", usuario: "Pedro Costa", data: "2024-01-15 10:45", observacoes: "Entrevista cliente" },
  ];

  const handleSearch = () => {
    // Simular busca por código
    if (searchCode === "CAM001") {
      setSelectedEquipment({
        id: 1,
        nome: "Câmera Sony FX6",
        codigo: "CAM001",
        categoria: "Câmera",
        status: "Disponível",
        localizacao: "Estoque"
      });
    } else if (searchCode === "CAM002") {
      setSelectedEquipment({
        id: 2,
        nome: "Câmera Canon EOS R5",
        codigo: "CAM002",
        categoria: "Câmera",
        status: "Em uso",
        localizacao: "João Silva",
        usuarioAtual: "João Silva"
      });
    }
  };

  const handleAction = (actionType: "checkout" | "checkin") => {
    setAction(actionType);
  };

  const getActionColor = (tipo: string) => {
    return tipo === "Retirada" 
      ? "bg-orange-100 text-orange-800 border-orange-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Check-in / Check-out</h1>
          <p className="text-muted-foreground">Controle de retirada e devolução de equipamentos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Equipamento
              </CardTitle>
              <CardDescription>
                Digite o código ou escaneie o QR Code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Digite o código do equipamento..."
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              {/* Equipment Found */}
              {selectedEquipment && (
                <div className="p-4 border rounded-lg bg-accent/50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{selectedEquipment.nome}</h3>
                        <p className="text-sm text-muted-foreground">Código: {selectedEquipment.codigo}</p>
                        <p className="text-sm text-muted-foreground">Categoria: {selectedEquipment.categoria}</p>
                      </div>
                      <Badge variant="outline" className={
                        selectedEquipment.status === 'Disponível' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }>
                        {selectedEquipment.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Localização: </span>
                      <span className="font-medium">{selectedEquipment.localizacao}</span>
                    </div>

                    {selectedEquipment.usuarioAtual && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Em uso por: </span>
                        <span className="font-medium">{selectedEquipment.usuarioAtual}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {selectedEquipment.status === 'Disponível' ? (
                        <Button 
                          onClick={() => handleAction('checkout')}
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Retirar
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleAction('checkin')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Devolver
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Form */}
              {action && selectedEquipment && (
                <div className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-semibold">
                    {action === 'checkout' ? 'Retirar Equipamento' : 'Devolver Equipamento'}
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Usuário Responsável</label>
                      <Input placeholder="Nome do usuário..." />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Observações (opcional)</label>
                      <Textarea placeholder="Detalhes sobre o uso..." />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Confirmar {action === 'checkout' ? 'Retirada' : 'Devolução'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setAction(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Movements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Movimentações Recentes
              </CardTitle>
              <CardDescription>
                Últimas ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{movement.equipamento}</p>
                        <p className="text-xs text-muted-foreground">Código: {movement.codigo}</p>
                      </div>
                      <Badge variant="outline" className={getActionColor(movement.tipo)}>
                        {movement.tipo}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <User className="h-3 w-3" />
                      {movement.usuario}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {movement.data}
                    </div>
                    
                    {movement.observacoes && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {movement.observacoes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
