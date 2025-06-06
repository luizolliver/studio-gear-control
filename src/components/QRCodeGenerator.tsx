
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QRCodeGeneratorProps {
  value: string
  size?: number
}

export function QRCodeGenerator({ value, size = 150 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, { width: size }, (error) => {
        if (error) console.error('Erro ao gerar QR Code:', error)
      })
    }
  }, [value, size])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas ref={canvasRef} />
      </CardContent>
    </Card>
  )
}
