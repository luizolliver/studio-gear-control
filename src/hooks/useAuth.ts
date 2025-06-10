
import { useEffect, useState } from 'react'
import { supabase, Usuario } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se existe usuário logado no localStorage
    const storedUser = localStorage.getItem('usuario_logado')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          empresas(nome)
        `)
        .eq('email', email)
        .eq('senha', password)
        .eq('ativo', true)
        .maybeSingle()

      if (error) throw error
      
      if (!data) {
        return { data: null, error: { message: 'Email ou senha incorretos' } }
      }

      // Salvar usuário no localStorage
      localStorage.setItem('usuario_logado', JSON.stringify(data))
      setUser(data)
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('usuario_logado')
      setUser(null)
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signUp = async (userData: Omit<Usuario, 'id' | 'criado_em'>) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([userData])
        .select()

      if (error) throw error
      return { data: data[0], error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
