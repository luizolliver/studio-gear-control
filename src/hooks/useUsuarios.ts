
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Usuario } from '@/lib/supabase'

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome')
      
      if (error) throw error
      return data as Usuario[]
    }
  })
}

export const useCreateUsuario = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (usuario: Omit<Usuario, 'id' | 'criado_em'>) => {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([usuario])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
}

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Usuario> & { id: string }) => {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
}

export const useDeleteUsuario = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
}
