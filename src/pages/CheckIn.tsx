
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { QrCode, Search, ArrowRight, ArrowLeft, Clock, User } from "lucide-react";
import { useState } from "react";
import { useEquipamentos, useUpdateEquipamento } from "@/hooks/useEquipamentos";
import { useMovimentacoes, useCreateMovimentacao } from "@/hooks/useMovimentacoes";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { useToast } from "@/hooks/use-toast";

export default function CheckIn() {
  const [searchCode, setSearchCode] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [action, setAction] = useState<"checkout" | "checkin" | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const { data: equipamentos } = useEquipamentos();
  const { data: movimentacoes } = useMovimentacoes();
  const updateEquipamento = useUpdateEquipamento();
  const createMovimentacao = useCreateMovimentacao();
  const { toast } = useToast();

  const handleSearch = () => {
    const equipamento = equipamentos?.find(eq => 
      eq.codigo.toLowerCase() === searchCode.toLowerCase()
    );
    
    if (equipamento) {
      setSelectedEquipment(equipamento);
    } else {
      toast({
        title: "Equipamento não encontrado",
        description: `Nenhum equipamento com código "${searchCode}" foi encontrado.`,
        variant: "destructive"
      });
      setSelectedEquipment(null);
    }
  };

  const handleQRScan = (result: string) => {
    setSearchCode(result);
    setShowScanner(false);
    const equipamento = equipamentos?.find(eq => 
      eq.codigo.toLowerCase() === result.toLowerCase()
    );
    
    if (equipamento) {
      setSelectedEquipment(equipamento);
    }
  };

  const handleAction = (actionType: "checkout" | "checkin") => {
    setAction(actionType);
  };

  const handleConfirm = async () => {
    if (!selectedEquipment || !action) return;

    try {
      const isCheckout = action === 'checkout';
      
      // Atualizar status do equipamento
      await updateEquipamento.mutateAsync({
        id: selectedEquipment.id,
        status: isCheckout ? 'Em uso' : 'Disponível',
        usuario_atual: isCheckout ? usuario : null,
        localizacao: isCheckout ? usuario : 'Estoque'
      });

      // Criar movimentação
      await createMovimentacao.mutateAsync({
        equipamento_id: selectedEquipment.id,
        tipo: isCheckout ? 'Retirada' : 'Devolução',
        por: usuario,
        observacoes: observacoes
      });

      toast({
        title: `${isCheckout ? 'Retirada' : 'Devolução'} realizada com sucesso!`,
        description: `Equipamento ${selectedEquipment.nome} foi ${isCheckout ? 'retirado' : 'devolvido'}.`
      });

      // Reset form
      setSelectedEquipment(null);
      setAction(null);
      setUsuario("");
      setObservacoes("");
      setSearchCode("");

    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a operação.",
        variant: "destructive"
      });
    }
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
                <Button variant="outline" onClick={() => setShowScanner(!showScanner)}>
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              {/* QR Scanner */}
              {showScanner && (
                <QRCodeScanner 
                  onScan={handleQRScan}
                  onError={(error) => console.log('Scanner error:', error)}
                />
              )}

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

                    {selectedEquipment.usuario_atual && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Em uso por: </span>
                        <span className="font-medium">{selectedEquipment.usuario_atual}</span>
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
                      <Input 
                        placeholder="Nome do usuário..." 
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Observações (opcional)</label>
                      <Textarea 
                        placeholder="Detalhes sobre o uso..." 
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        onClick={handleConfirm}
                        disabled={!usuario.trim()}
                      >
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
                {movimentacoes?.map((movement) => (
                  <div key={movement.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{movement.equipamentos?.nome}</p>
                        <p className="text-xs text-muted-foreground">Código: {movement.equipamentos?.codigo}</p>
                      </div>
                      <Badge variant="outline" className={getActionColor(movement.tipo)}>
                        {movement.tipo}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <User className="h-3 w-3" />
                      {movement.por}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(movement.data).toLocaleString()}
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
