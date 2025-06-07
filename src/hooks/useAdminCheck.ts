
import { useUsuarioLogado } from '@/hooks/useUsuarioLogado'

export const useAdminCheck = () => {
  const { data: usuario, isLoading } = useUsuarioLogado()
  
  // Verificar se o usuário tem função de admin na tabela usuarios
  const isAdmin = usuario?.funcao === 'admin'
  
  return { isAdmin, isLoading, usuario }
}
