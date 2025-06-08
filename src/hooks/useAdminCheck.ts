
import { useAuth } from '@/hooks/useAuth'

export const useAdminCheck = () => {
  const { user, loading } = useAuth()
  
  console.log('useAdminCheck - User:', user)
  
  // Todos os usuários autenticados são admin
  const isAdmin = !!user
  
  console.log('useAdminCheck - isAdmin:', isAdmin)
  
  return { 
    isAdmin, 
    isLoading: loading, 
    usuario: user ? {
      id: user.id,
      nome: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
      email: user.email || '',
      telefone: '',
      funcao: 'admin' as const,
      ativo: true,
      criado_em: new Date().toISOString()
    } : null
  }
}
