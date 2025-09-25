// @ts-nocheck
import React, { useState, useRef } from 'react';
import { ArrowLeft, ScanLine, KeyRound, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useAuth } from './AuthContext';

export const AdminLogin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { signInAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      setError('Please enter or scan your employee ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signInAdmin(employeeId.trim());
      if (!result.success) {
        setError(result.error || 'Invalid employee ID');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowScanner(true);
    } catch (err) {
      setError('Unable to access camera. Please enter your ID manually.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowScanner(false);
  };

  const simulateBarcodeScan = () => {
    // Simulate scanning for demo purposes
    const demoEmployeeId = 'EMP001';
    setEmployeeId(demoEmployeeId);
    stopCamera();
    setError('');
  };

  if (showScanner) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* iOS-style status bar spacing */}
        <div className="h-11 bg-black"></div>
        
        {/* Scanner Header */}
        <div className="flex items-center justify-between p-4 bg-black/80 relative z-10">
          <Button
            onClick={stopCamera}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2"
          >
            <X className="w-6 h-6" />
          </Button>
          <h2 className="text-white font-medium">Scan Employee ID</h2>
          <div className="w-10"></div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Scanning Frame */}
              <div className="w-64 h-40 border-2 border-white rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>
                
                {/* Scanning Line Animation */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="w-full h-0.5 bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50 transform -translate-y-2 animate-bounce"></div>
                </div>
              </div>
              
              <p className="text-white text-center mt-4 text-base">
                Position the barcode within the frame
              </p>
            </div>
          </div>

          {/* Demo Scan Button */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={simulateBarcodeScan}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-xl"
            >
              Simulate Scan (Demo)
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-black/80">
          <p className="text-white/80 text-center text-sm">
            Hold your employee ID steady within the scanning area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center px-4">
      {/* iOS-style status bar spacing */}
      <div className="absolute top-0 left-0 right-0 h-11 bg-transparent"></div>
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mr-3 p-2 hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Login</h1>
            <p className="text-base text-gray-600">Access your employee dashboard</p>
          </div>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Identity</h2>
            <p className="text-sm text-gray-600">
              Scan your employee ID badge or enter your employee number
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <Input
                type="text"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your employee ID"
                className="h-12 text-base"
              />
            </div>

            {/* Scan Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={startCamera}
              variant="outline"
              className="w-full h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
            >
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <ScanLine className="w-5 h-5" />
                Scan Employee ID Badge
              </div>
            </Button>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading || !employeeId.trim()}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base font-medium rounded-xl shadow-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo:</strong> Use employee ID "EMP001" or scan the demo barcode to access the admin dashboard.
            </p>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            🔒 Secure employee authentication • Report issues to IT support
          </p>
        </div>
      </div>
    </div>
  );
};