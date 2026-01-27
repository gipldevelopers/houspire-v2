// src\components\projects\uploads\QRCodeGenerator.js
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Copy, 
  CheckCircle2, 
  RefreshCw,
  Smartphone,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadService } from '@/services/upload.service';

export default function QRCodeGenerator({ projectId }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const result = await uploadService.generateQRSession(projectId);
  
      if (result.success) {
        setQrData(result.data.qrSession);
        setTimeLeft(3600); // 1 hour in seconds
        toast.success('QR Code generated successfully!');
      } else {
        throw new Error(result.message || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      
      if (error.message.includes('Authentication failed') || error.message.includes('Please log in')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error(error.message || 'Failed to generate QR code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (qrData?.mobileUploadUrl) {
      navigator.clipboard.writeText(qrData.mobileUploadUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!qrData) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Generate QR Code
          </h3>
          <p className="text-blue-700 mb-4">
            Create a QR code to upload photos directly from your mobile device
          </p>
          <Button 
            onClick={generateQRCode}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">QR Code Ready!</span>
            </div>
            <Badge variant="outline" className="bg-white text-green-700">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
          </div>

          {/* QR Code Display */}
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg inline-block">
              <img 
                src={qrData.qrCodeUrl} 
                alt="QR Code for mobile upload"
                className="w-48 h-48 mx-auto"
              />
            </div>
            
            <p className="text-sm text-green-700">
              Scan this QR code with your phone camera to upload photos
            </p>

            {/* Direct Link */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={copyLink}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              <Button
                variant="outline"
                onClick={generateQRCode}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              How to use:
            </h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Open your phone's camera app</li>
              <li>Point camera at the QR code above</li>
              <li>Tap the notification to open upload page</li>
              <li>Select room type and take/upload photos</li>
              <li>Submit to automatically sync with your project</li>
            </ol>
          </div>

          {timeLeft < 300 && timeLeft > 0 && (
            <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              QR code expires in {formatTime(timeLeft)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}