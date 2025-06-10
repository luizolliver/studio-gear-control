
import { createClient } from '@supabase/supabase-js'

// Configure suas credenciais do Supabase self-hosted aqui
const supabaseUrl = 'https://supabaselpserver.masterapps.net'  // Ex: https://supabase.minhaempresa.com
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.vQ-zvbPnbWrxwcCO_2AHXTeXCPgynZuNvads3OUuisw'   // Chave pública/anon do seu projeto

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos baseados na sua estrutura de banco
export interface Empresa {
  id: string
  nome: string
  cnpj?: string
  telefone?: string
  email?: string
  endereco?: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  telefone?: string
  funcao: 'funcionario' | 'admin'
  empresa_id?: string
  is_master_admin: boolean
  ativo: boolean
  criado_em: string
  empresas?: {
    nome: string
  }
}

export interface Equipamento {
  id: string
  nome: string
  codigo: string
  categoria: string
  status: 'Disponível' | 'Em uso' | 'Manutenção'
  localizacao: string
  usuario_atual?: string
  empresa_id: string
  atualizado_em: string
}

export interface HistoricoMovimentacao {
  id: string
  equipamento_id: string
  tipo: 'Retirada' | 'Devolução'
  por: string
  data: string
  observacoes?: string
  empresa_id: string
  equipamentos?: {
    nome: string
    codigo: string
  }
}
