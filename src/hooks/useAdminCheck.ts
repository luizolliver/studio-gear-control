
import { useAuth } from '@/hooks/useAuth'

export const useAdminCheck = () => {
  const { user } = useAuth()
  
  // Verificar se o usuário tem função de admin
  // Você pode ajustar essa lógica conforme sua estrutura de dados
  const isAdmin = user?.user_metadata?.role === 'admin' || 
                   user?.email?.includes('admin') || 
                   user?.user_metadata?.funcao === 'admin'
  
  return { isAdmin }
}
