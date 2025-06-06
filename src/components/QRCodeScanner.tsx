
import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Camera, AlertCircle } from 'lucide-react'

interface QRCodeScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
}

export function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const startScanning = async () => {
    setIsScanning(true)
    setError(null)
    setPermissionDenied(false)
    
    // Verificar se há permissão para câmera
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
    } catch (err: any) {
      console.error('Erro de permissão de câmera:', err)
      setPermissionDenied(true)
      setError('Permissão de câmera negada. Verifique as configurações do navegador.')
      setIsScanning(false)
      return
    }

    try {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2
        },
        false
      )

      scannerRef.current.render(
        (decodedText) => {
          console.log('QR Code escaneado:', decodedText)
          onScan(decodedText)
          stopScanning()
        },
        (error) => {
          // Não logar erros de "No QR code found" para evitar spam no console
          if (!error.includes('No QR code found')) {
            console.error('Erro no scanner:', error)
            onError?.(error)
          }
        }
      )
    } catch (err: any) {
      console.error('Erro ao iniciar scanner:', err)
      setError('Erro ao acessar a câmera. Verifique as permissões.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
      } catch (err) {
        console.log('Erro ao limpar scanner:', err)
      }
      scannerRef.current = null
    }
    setIsScanning(false)
    setError(null)
    setPermissionDenied(false)
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear()
        } catch (err) {
          console.log('Erro na limpeza do scanner:', err)
        }
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Scanner QR Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
            {permissionDenied && (
              <div className="mt-2 text-xs">
                <p className="font-medium">Como resolver:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>iOS: Configurações → Privacidade → Câmera → Safari</li>
                  <li>Android: Configurações → Apps → Chrome → Permissões → Câmera</li>
                  <li>Recarregue a página após alterar as permissões</li>
                </ul>
              </div>
            )}
          </div>
        )}
        
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Iniciar Scanner
          </Button>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" style={{ width: '100%' }}></div>
            <Button onClick={stopScanning} variant="outline" className="w-full">
              Parar Scanner
            </Button>
          </div>
        )}
        
        {isScanning && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Aponte a câmera para um QR Code
          </p>
        )}
      </CardContent>
    </Card>
  )
}
