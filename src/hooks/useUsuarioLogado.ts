
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { supabase, Usuario } from '@/lib/supabase'

export const useUsuarioLogado = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['usuario-logado', user?.email],
    queryFn: async () => {
      if (!user?.email) return null
      
      console.log('Buscando usuário com email:', user.email)
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', user.email)
        .eq('ativo', true)
        .maybeSingle()
      
      if (error) {
        console.log('Erro ao buscar usuário:', error)
        return null
      }
      
      console.log('Usuário encontrado:', data)
      return data as Usuario | null
    },
    enabled: !!user?.email
  })
}
