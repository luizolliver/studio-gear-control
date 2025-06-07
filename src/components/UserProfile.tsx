
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Mail, Edit2, Check, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export function UserProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || '')

  const handleSave = async () => {
    // Em uma implementação real, aqui você salvaria no Supabase
    toast({
      title: 'Perfil atualizado',
      description: 'Suas informações foram salvas com sucesso.'
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDisplayName(user?.user_metadata?.name || user?.email?.split('@')[0] || '')
    setIsEditing(false)
  }

  const getUserInitials = () => {
    const name = user?.user_metadata?.name || user?.email || ''
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Perfil do Usuário
        </CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{getUserDisplayName()}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nome de Exibição</Label>
            {isEditing ? (
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Digite seu nome"
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">
                {displayName || 'Não informado'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="p-2 bg-muted rounded-md text-muted-foreground">
              {user?.email}
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Check className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-1" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
