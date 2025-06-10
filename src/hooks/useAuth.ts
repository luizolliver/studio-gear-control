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
      console.log('Tentando fazer login com:', email)
      
      // Primeiro, buscar o usuário básico
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .eq('ativo', true)
        .maybeSingle()

      if (userError) {
        console.log('Erro na query de usuário:', userError)
        throw userError
      }
      
      if (!usuario) {
        console.log('Usuário não encontrado ou credenciais incorretas')
        return { data: null, error: { message: 'Email ou senha incorretos' } }
      }

      console.log('Usuário encontrado:', usuario)

      // Se encontrou o usuário e tem empresa_id, buscar dados da empresa
      let usuarioCompleto = usuario
      if (usuario.empresa_id) {
        console.log('Buscando dados da empresa:', usuario.empresa_id)
        
        const { data: empresa, error: empresaError } = await supabase
          .from('empresas')
          .select('nome')
          .eq('id', usuario.empresa_id)
          .maybeSingle()

        if (!empresaError && empresa) {
          usuarioCompleto = {
            ...usuario,
            empresas: { nome: empresa.nome }
          }
        } else {
          console.log('Erro ao buscar empresa ou empresa não encontrada:', empresaError)
        }
      }

      // Salvar usuário no localStorage
      localStorage.setItem('usuario_logado', JSON.stringify(usuarioCompleto))
      setUser(usuarioCompleto)
      
      console.log('Login realizado com sucesso')
      return { data: usuarioCompleto, error: null }
    } catch (error: any) {
      console.log('Erro no login:', error)
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
