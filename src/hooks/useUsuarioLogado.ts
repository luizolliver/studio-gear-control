
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { supabase, Usuario } from '@/lib/supabase'

export const useUsuarioLogado = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['usuario-logado', user?.email],
    queryFn: async () => {
      if (!user?.email) return null
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', user.email)
        .eq('ativo', true)
        .single()
      
      if (error) {
        console.log('Usuário não encontrado na tabela usuarios:', error)
        return null
      }
      
      return data as Usuario
    },
    enabled: !!user?.email
  })
}
