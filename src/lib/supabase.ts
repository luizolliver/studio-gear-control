
import { createClient } from '@supabase/supabase-js'

// Configure suas credenciais do Supabase self-hosted aqui
const supabaseUrl = 'https://SEU_DOMINIO_SUPABASE'  // Ex: https://supabase.minhaempresa.com
const supabaseAnonKey = 'SUA_CHAVE_ANON_PUBLICA'   // Chave pública/anon do seu projeto

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos baseados na sua estrutura de banco
export interface Equipamento {
  id: string
  nome: string
  codigo: string
  categoria: string
  status: 'Disponível' | 'Em uso' | 'Manutenção'
  localizacao: string
  usuario_atual?: string
  atualizado_em: string
}

export interface HistoricoMovimentacao {
  id: string
  equipamento_id: string
  tipo: 'Retirada' | 'Devolução'
  por: string
  data: string
  observacoes?: string
  equipamentos?: {
    nome: string
    codigo: string
  }
}

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone: string
  funcao: 'funcionario' | 'admin'
  ativo: boolean
  criado_em: string
}
