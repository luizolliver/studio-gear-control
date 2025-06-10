
import { useAuth } from '@/hooks/useAuth'

export const useAdminCheck = () => {
  const { user, loading } = useAuth()
  
  console.log('useAdminCheck - User:', user)
  
  // Verificar se é admin da empresa ou master admin
  const isAdmin = user && (user.funcao === 'admin' || user.is_master_admin)
  const isMasterAdmin = user && user.is_master_admin
  
  console.log('useAdminCheck - isAdmin:', isAdmin)
  console.log('useAdminCheck - isMasterAdmin:', isMasterAdmin)
  
  return { 
    isAdmin: !!isAdmin, 
    isMasterAdmin: !!isMasterAdmin,
    isLoading: loading, 
    usuario: user
  }
}
