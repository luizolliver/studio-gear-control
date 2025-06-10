
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useCreateEmpresa, useUpdateEmpresa } from '@/hooks/useEmpresas'
import { useToast } from '@/hooks/use-toast'
import { Empresa } from '@/lib/supabase'

interface EmpresaModalProps {
  isOpen: boolean
  onClose: () => void
  empresa?: Empresa | null
}

export function EmpresaModal({ isOpen, onClose, empresa }: EmpresaModalProps) {
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')
  const [ativo, setAtivo] = useState(true)
  
  const createEmpresa = useCreateEmpresa()
  const updateEmpresa = useUpdateEmpresa()
  const { toast } = useToast()

  useEffect(() => {
    if (empresa) {
      setNome(empresa.nome)
      setCnpj(empresa.cnpj || '')
      setTelefone(empresa.telefone || '')
      setEmail(empresa.email || '')
      setEndereco(empresa.endereco || '')
      setAtivo(empresa.ativo)
    } else {
      setNome('')
      setCnpj('')
      setTelefone('')
      setEmail('')
      setEndereco('')
      setAtivo(true)
    }
  }, [empresa])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const empresaData = {
      nome,
      cnpj: cnpj || undefined,
      telefone: telefone || undefined,
      email: email || undefined,
      endereco: endereco || undefined,
      ativo
    }

    try {
      if (empresa) {
        await updateEmpresa.mutateAsync({ id: empresa.id, ...empresaData })
        toast({
          title: 'Empresa atualizada',
          description: 'Empresa foi atualizada com sucesso.'
        })
      } else {
        await createEmpresa.mutateAsync(empresaData)
        toast({
          title: 'Empresa criada',
          description: 'Nova empresa foi criada com sucesso.'
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar empresa. Tente novamente.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {empresa ? 'Editar Empresa' : 'Nova Empresa'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Empresa</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço completo da empresa"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ativo">Empresa Ativa</Label>
            <Switch
              id="ativo"
              checked={ativo}
              onCheckedChange={setAtivo}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createEmpresa.isPending || updateEmpresa.isPending}
            >
              {createEmpresa.isPending || updateEmpresa.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
