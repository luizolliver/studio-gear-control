
import { useUsuarioLogado } from '@/hooks/useUsuarioLogado'

export const useAdminCheck = () => {
  const { data: usuario, isLoading } = useUsuarioLogado()
  
  console.log('useAdminCheck - Usuario:', usuario)
  console.log('useAdminCheck - Função:', usuario?.funcao)
  
  // Verificar se o usuário tem função de admin na tabela usuarios
  const isAdmin = usuario?.funcao === 'admin'
  
  console.log('useAdminCheck - isAdmin:', isAdmin)
  
  return { isAdmin, isLoading, usuario }
}
