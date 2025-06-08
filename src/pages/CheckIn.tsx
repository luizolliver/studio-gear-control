
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { QrCode, Search, ArrowRight, ArrowLeft, Clock, User, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useEquipamentos, useUpdateEquipamento } from "@/hooks/useEquipamentos";
import { useMovimentacoes, useCreateMovimentacao } from "@/hooks/useMovimentacoes";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function CheckIn() {
  const [searchCode, setSearchCode] = useState("");
  const [selectedEquipments, setSelectedEquipments] = useState<any[]>([]);
  const [action, setAction] = useState<"checkout" | "checkin" | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: equipamentos } = useEquipamentos();
  const { data: movimentacoes } = useMovimentacoes();
  const updateEquipamento = useUpdateEquipamento();
  const createMovimentacao = useCreateMovimentacao();
  const { toast } = useToast();
  const { user } = useAuth();

  // Preencher automaticamente o campo usuário com o nome do usuário logado
  useEffect(() => {
    if (user && !usuario) {
      const displayName = user.user_metadata?.name || user.email?.split('@')[0] || '';
      setUsuario(displayName);
    }
  }, [user, usuario]);

  const addEquipment = (codigo: string) => {
    const equipamento = equipamentos?.find(eq => 
      eq.codigo.toLowerCase() === codigo.toLowerCase()
    );
    
    if (equipamento) {
      // Verificar se já foi adicionado
      if (selectedEquipments.find(eq => eq.id === equipamento.id)) {
        toast({
          title: "Equipamento já adicionado",
          description: `O equipamento "${equipamento.nome}" já está na lista.`,
          variant: "destructive"
        });
        return;
      }
      
      // Verificar se todos os equipamentos selecionados têm o mesmo status ou se é o primeiro
      if (selectedEquipments.length > 0) {
        const firstStatus = selectedEquipments[0].status;
        if (equipamento.status !== firstStatus) {
          toast({
            title: "Status incompatível",
            description: `Todos os equipamentos devem ter o mesmo status. O primeiro é "${firstStatus}" e este é "${equipamento.status}".`,
            variant: "destructive"
          });
          return;
        }
      }
      
      setSelectedEquipments(prev => [...prev, equipamento]);
      setSearchCode("");
      
      // Definir ação automaticamente baseada no status
      if (selectedEquipments.length === 0) {
        setAction(equipamento.status === 'Disponível' ? 'checkout' : 'checkin');
      }
      
      toast({
        title: "Equipamento adicionado",
        description: `"${equipamento.nome}" foi adicionado à lista.`
      });
    } else {
      toast({
        title: "Equipamento não encontrado",
        description: `Nenhum equipamento com código "${codigo}" foi encontrado.`,
        variant: "destructive"
      });
    }
  };

  const handleSearch = () => {
    if (searchCode.trim()) {
      addEquipment(searchCode.trim());
    }
  };

  const handleQRScan = (result: string) => {
    addEquipment(result);
    setShowScanner(false);
  };

  const removeEquipment = (id: string) => {
    setSelectedEquipments(prev => prev.filter(eq => eq.id !== id));
    if (selectedEquipments.length === 1) {
      setAction(null);
    }
  };

  const clearAll = () => {
    setSelectedEquipments([]);
    setAction(null);
    setObservacoes("");
  };

  const handleConfirm = async () => {
    if (selectedEquipments.length === 0 || !action || !usuario.trim()) return;

    setIsProcessing(true);
    
    try {
      const isCheckout = action === 'checkout';
      let successCount = 0;
      let errorCount = 0;

      // Processar cada equipamento
      for (const equipamento of selectedEquipments) {
        try {
          const updateData: any = {
            id: equipamento.id,
            status: isCheckout ? 'Em uso' : 'Disponível'
          };

          if (isCheckout) {
            updateData.localizacao = usuario;
            if ('usuario_atual' in equipamento) {
              updateData.usuario_atual = usuario;
            }
          } else {
            updateData.localizacao = 'Estoque';
            if ('usuario_atual' in equipamento) {
              updateData.usuario_atual = null;
            }
          }

          await updateEquipamento.mutateAsync(updateData);

          await createMovimentacao.mutateAsync({
            equipamento_id: equipamento.id,
            tipo: isCheckout ? 'Retirada' : 'Devolução',
            por: usuario,
            observacoes: observacoes || undefined
          });

          successCount++;
        } catch (error) {
          console.error(`Erro ao processar equipamento ${equipamento.nome}:`, error);
          errorCount++;
        }
      }

      // Mostrar resultado
      if (successCount > 0) {
        toast({
          title: `${isCheckout ? 'Retiradas' : 'Devoluções'} processadas!`,
          description: `${successCount} equipamento(s) ${isCheckout ? 'retirado(s)' : 'devolvido(s)'} com sucesso.${errorCount > 0 ? ` ${errorCount} erro(s) encontrado(s).` : ''}`
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Erro no processamento",
          description: "Nenhum equipamento foi processado devido a erros.",
          variant: "destructive"
        });
      }

      // Limpar formulário
      setSelectedEquipments([]);
      setAction(null);
      setObservacoes("");
      setSearchCode("");
      
      // Manter o nome do usuário para próximas operações
      const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || '';
      setUsuario(displayName);

    } catch (error) {
      console.error('Erro geral no processamento:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o processamento.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionColor = (tipo: string) => {
    return tipo === "Retirada" 
      ? "bg-orange-100 text-orange-800 border-orange-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'Disponível' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
                Buscar Equipamentos
              </CardTitle>
              <CardDescription>
                Digite códigos ou escaneie QR Codes para adicionar múltiplos equipamentos
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
                <Button onClick={handleSearch} disabled={!searchCode.trim()}>
                  <Plus className="h-4 w-4" />
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

              {/* Selected Equipments List */}
              {selectedEquipments.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Equipamentos Selecionados ({selectedEquipments.length})</h4>
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      Limpar Todos
                    </Button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {selectedEquipments.map((equipamento) => (
                      <div key={equipamento.id} className="p-3 border rounded-lg bg-accent/50 flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-sm">{equipamento.nome}</h5>
                              <p className="text-xs text-muted-foreground">Código: {equipamento.codigo}</p>
                              <p className="text-xs text-muted-foreground">Categoria: {equipamento.categoria}</p>
                            </div>
                            <Badge variant="outline" className={getStatusBadgeColor(equipamento.status)}>
                              {equipamento.status}
                            </Badge>
                          </div>
                          
                          <div className="text-xs">
                            <span className="text-muted-foreground">Localização: </span>
                            <span className="font-medium">{equipamento.localizacao}</span>
                          </div>

                          {equipamento.usuario_atual && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Em uso por: </span>
                              <span className="font-medium">{equipamento.usuario_atual}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeEquipment(equipamento.id)}
                          className="text-destructive hover:text-destructive ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Form */}
              {action && selectedEquipments.length > 0 && (
                <div className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-semibold">
                    {action === 'checkout' ? 'Retirar Equipamentos' : 'Devolver Equipamentos'} ({selectedEquipments.length} item{selectedEquipments.length > 1 ? 's' : ''})
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Usuário Responsável</label>
                      <Input 
                        placeholder="Nome do usuário..." 
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Preenchido automaticamente com seu usuário
                      </p>
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
                        disabled={!usuario.trim() || isProcessing}
                      >
                        {isProcessing ? 'Processando...' : `Confirmar ${action === 'checkout' ? 'Retiradas' : 'Devoluções'}`}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={clearAll}
                        disabled={isProcessing}
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
