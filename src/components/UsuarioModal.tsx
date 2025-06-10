
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCreateUsuario, useUpdateUsuario } from '@/hooks/useUsuarios'
import { useToast } from '@/hooks/use-toast'
import { Usuario } from '@/lib/supabase'

interface UsuarioModalProps {
  isOpen: boolean
  onClose: () => void
  usuario?: Usuario | null
}

export function UsuarioModal({ isOpen, onClose, usuario }: UsuarioModalProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [funcao, setFuncao] = useState<'funcionario' | 'admin'>('funcionario')
  const [ativo, setAtivo] = useState(true)
  
  const createUsuario = useCreateUsuario()
  const updateUsuario = useUpdateUsuario()
  const { toast } = useToast()

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome)
      setEmail(usuario.email)
      setSenha('') // Não carregar senha por segurança
      setTelefone(usuario.telefone || '')
      setFuncao(usuario.funcao)
      setAtivo(usuario.ativo)
    } else {
      setNome('')
      setEmail('')
      setSenha('')
      setTelefone('')
      setFuncao('funcionario')
      setAtivo(true)
    }
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!usuario && !senha) {
      toast({
        title: 'Erro',
        description: 'Senha é obrigatória para novos usuários.',
        variant: 'destructive'
      })
      return
    }

    const usuarioData = {
      nome,
      email,
      telefone,
      funcao,
      ativo,
      senha: senha || undefined, // Só incluir senha se fornecida
      is_master_admin: false
    }

    try {
      if (usuario) {
        // Se estiver editando e não forneceu nova senha, remover do objeto
        if (!senha) {
          const { senha: _, ...dataWithoutPassword } = usuarioData
          await updateUsuario.mutateAsync({ id: usuario.id, ...dataWithoutPassword })
        } else {
          await updateUsuario.mutateAsync({ id: usuario.id, ...usuarioData })
        }
        toast({
          title: 'Usuário atualizado',
          description: 'Usuário foi atualizado com sucesso.'
        })
      } else {
        await createUsuario.mutateAsync(usuarioData)
        toast({
          title: 'Usuário criado',
          description: 'Novo usuário foi criado com sucesso.'
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar usuário. Tente novamente.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">
              {usuario ? 'Nova Senha (deixe vazio para manter atual)' : 'Senha'}
            </Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required={!usuario}
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
            <Label htmlFor="funcao">Função</Label>
            <Select value={funcao} onValueChange={(value: 'funcionario' | 'admin') => setFuncao(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funcionario">Funcionário</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ativo">Usuário Ativo</Label>
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
              disabled={createUsuario.isPending || updateUsuario.isPending}
            >
              {createUsuario.isPending || updateUsuario.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
