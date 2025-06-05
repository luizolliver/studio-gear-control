
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, HistoricoMovimentacao } from '@/lib/supabase'

export const useMovimentacoes = () => {
  return useQuery({
    queryKey: ['movimentacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('historico_movimentacoes')
        .select(`
          *,
          equipamentos(nome, codigo)
        `)
        .order('data', { ascending: false })
        .limit(20)
      
      if (error) throw error
      return data
    }
  })
}

export const useCreateMovimentacao = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (movimentacao: Omit<HistoricoMovimentacao, 'id' | 'data'>) => {
      const { data, error } = await supabase
        .from('historico_movimentacoes')
        .insert([{
          ...movimentacao,
          data: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] })
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
    }
  })
}
