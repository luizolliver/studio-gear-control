
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateEquipamento, useUpdateEquipamento } from "@/hooks/useEquipamentos";
import { Equipamento } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface EquipamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipamento?: Equipamento | null;
}

export function EquipamentoModal({ isOpen, onClose, equipamento }: EquipamentoModalProps) {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState<"Disponível" | "Em uso" | "Manutenção">("Disponível");
  const [localizacao, setLocalizacao] = useState("");

  const { toast } = useToast();
  const { user } = useAuth();
  const createEquipamento = useCreateEquipamento();
  const updateEquipamento = useUpdateEquipamento();

  const isEditing = !!equipamento;

  useEffect(() => {
    if (equipamento) {
      setNome(equipamento.nome);
      setCodigo(equipamento.codigo);
      setCategoria(equipamento.categoria);
      setStatus(equipamento.status);
      setLocalizacao(equipamento.localizacao);
    } else {
      setNome("");
      setCodigo("");
      setCategoria("");
      setStatus("Disponível");
      setLocalizacao("Estoque");
    }
  }, [equipamento, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !codigo || !categoria || !localizacao) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.empresa_id && !user?.is_master_admin) {
      toast({
        title: "Erro",
        description: "Usuário deve estar vinculado a uma empresa.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing) {
        await updateEquipamento.mutateAsync({
          id: equipamento.id,
          nome,
          codigo,
          categoria,
          status,
          localizacao
        });
        toast({
          title: "Sucesso",
          description: "Equipamento atualizado com sucesso!"
        });
      } else {
        await createEquipamento.mutateAsync({
          nome,
          codigo,
          categoria,
          status,
          localizacao,
          empresa_id: user.empresa_id || ''
        });
        toast({
          title: "Sucesso",
          description: "Equipamento criado com sucesso!"
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o equipamento.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Equipamento" : "Novo Equipamento"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Altere as informações do equipamento" : "Adicione um novo equipamento ao sistema"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Câmera Canon 5D"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: CAM001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="câmera">Câmera</SelectItem>
                  <SelectItem value="lente">Lente</SelectItem>
                  <SelectItem value="microfone">Microfone</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="iluminação">Iluminação</SelectItem>
                  <SelectItem value="acessório">Acessório</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "Disponível" | "Em uso" | "Manutenção") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Em uso">Em uso</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Estoque, Sala 1, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createEquipamento.isPending || updateEquipamento.isPending}>
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
