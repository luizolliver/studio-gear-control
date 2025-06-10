
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Empresa } from '@/lib/supabase'

export const useEmpresas = () => {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nome')
      
      if (error) throw error
      return data as Empresa[]
    }
  })
}

export const useCreateEmpresa = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (empresa: Omit<Empresa, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert([empresa])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] })
    }
  })
}

export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Empresa> & { id: string }) => {
      const { data, error } = await supabase
        .from('empresas')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] })
    }
  })
}

export const useDeleteEmpresa = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] })
    }
  })
}
