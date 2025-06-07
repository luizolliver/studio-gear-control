
import { ReactNode } from 'react'
import { useAdminCheck } from '@/hooks/useAdminCheck'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldX } from 'lucide-react'

interface AdminProtectedProps {
  children: ReactNode
}

export function AdminProtected({ children }: AdminProtectedProps) {
  const { isAdmin, isLoading, usuario } = useAdminCheck()

  console.log('AdminProtected - isLoading:', isLoading)
  console.log('AdminProtected - usuario:', usuario)
  console.log('AdminProtected - isAdmin:', isAdmin)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldX className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Esta funcionalidade está disponível apenas para administradores.
            </p>
            {usuario && (
              <p className="text-xs text-muted-foreground mt-2">
                Usuário: {usuario.nome} | Função: {usuario.funcao}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
