
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Equipamento } from '@/lib/supabase'

export const useEquipamentos = () => {
  return useQuery({
    queryKey: ['equipamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .order('nome')
      
      if (error) throw error
      return data as Equipamento[]
    }
  })
}

export const useCreateEquipamento = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (equipamento: Omit<Equipamento, 'id' | 'atualizado_em'>) => {
      const { data, error } = await supabase
        .from('equipamentos')
        .insert([equipamento])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
    }
  })
}

export const useUpdateEquipamento = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Equipamento> & { id: string }) => {
      const { data, error } = await supabase
        .from('equipamentos')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
    }
  })
}
