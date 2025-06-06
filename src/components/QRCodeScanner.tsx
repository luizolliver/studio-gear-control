
import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface QRCodeScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
}

export function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const startScanning = () => {
    setIsScanning(true)
    
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText)
        stopScanning()
      },
      (error) => {
        onError?.(error)
      }
    )
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scanner QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full">
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
      </CardContent>
    </Card>
  )
}
