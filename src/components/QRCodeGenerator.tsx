
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  title?: string
}

export function QRCodeGenerator({ value, size = 200, title = "QR Code" }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, { 
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('Erro ao gerar QR Code:', error)
      })
    }
  }, [value, size])

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `qrcode-${value}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  if (!value) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-muted-foreground text-sm">Nenhum código fornecido</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <canvas ref={canvasRef} />
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Código: {value}</p>
          <Button size="sm" variant="outline" onClick={downloadQRCode}>
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
