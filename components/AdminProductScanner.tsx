// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Camera, X, Plus, Save, Edit, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Product {
  barcode: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export const AdminProductScanner: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [productData, setProductData] = useState<Product>({
    barcode: '',
    name: '',
    price: 0,
    category: '',
    inStock: true,
  });
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowScanner(true);
    } catch (err) {
      setMessage('Unable to access camera. Please enter barcode manually.');
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
    // Generate a random barcode for demo
    const demoBarcode = `${Math.floor(Math.random() * 900000000000) + 100000000000}`;
    handleBarcodeScanned(demoBarcode);
    stopCamera();
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setScannedBarcode(barcode);
    setLoading(true);
    
    try {
      // Check if product already exists
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/product/${barcode}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const product = await response.json();
        setExistingProduct(product);
        setProductData(product);
        setMessage('Product found! You can edit the details below.');
      } else {
        setExistingProduct(null);
        setProductData({
          barcode,
          name: '',
          price: 0,
          category: '',
          inStock: true,
        });
        setMessage('New product - please fill in the details.');
      }
    } catch (error) {
      console.error('Product lookup error:', error);
      setMessage('Error looking up product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualBarcodeEntry = (barcode: string) => {
    if (barcode.length >= 8) { // Minimum barcode length
      handleBarcodeScanned(barcode);
    }
  };

  const saveProduct = async () => {
    if (!productData.barcode || !productData.name || productData.price <= 0) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/product`, {
        method: existingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setMessage(existingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        // Reset form after success
        setTimeout(() => {
          setProductData({
            barcode: '',
            name: '',
            price: 0,
            category: '',
            inStock: true,
          });
          setExistingProduct(null);
          setScannedBarcode('');
          setMessage('');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to save product.');
      }
    } catch (error) {
      console.error('Save product error:', error);
      setMessage('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setProductData({
      barcode: '',
      name: '',
      price: 0,
      category: '',
      inStock: true,
    });
    setExistingProduct(null);
    setScannedBarcode('');
    setMessage('');
  };

  if (showScanner) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Scanner Header */}
        <div className="flex items-center justify-between p-4 bg-black/80 relative z-10">
          <Button
            onClick={stopCamera}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2"
          >
            <X className="w-6 h-6" />
          </Button>
          <h2 className="text-white font-medium">Scan Product Barcode</h2>
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
              <div className="w-64 h-40 border-2 border-white rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>
                
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="w-full h-0.5 bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50 transform -translate-y-2 animate-bounce"></div>
                </div>
              </div>
              
              <p className="text-white text-center mt-4 text-base">
                Position the barcode within the frame
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={simulateBarcodeScan}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-xl"
            >
              Simulate Scan (Demo)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Add Product</h1>
        <p className="text-base text-muted-foreground mt-1">
          Scan or enter barcode to add/edit products
        </p>
      </div>

      <div className="px-4 space-y-6">
        {/* Barcode Scanner Section */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Scan Barcode</h3>
                <p className="text-sm text-muted-foreground">Use camera to scan product barcode</p>
              </div>
            </div>
            
            <Button
              onClick={startCamera}
              className="w-full flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Open Camera Scanner
            </Button>
          </div>
        </Card>

        {/* Manual Barcode Entry */}
        <Card className="p-4">
          <div className="space-y-4">
            <Label>Or Enter Barcode Manually</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={scannedBarcode}
                onChange={(e: any) => {
                  setScannedBarcode(e.target.value);
                  if (e.target.value !== productData.barcode) {
                    setProductData(prev => ({ ...prev, barcode: e.target.value }));
                  }
                }}
                onBlur={(e: any) => handleManualBarcodeEntry(e.target.value)}
                placeholder="Enter barcode number"
                className="flex-1"
              />
              <Button
                onClick={() => handleManualBarcodeEntry(scannedBarcode)}
                variant="outline"
                disabled={!scannedBarcode || loading}
              >
                Lookup
              </Button>
            </div>
          </div>
        </Card>

        {/* Status Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('success') 
              ? 'bg-success/10 border border-success/20 text-success' 
              : message.includes('Error') || message.includes('Failed')
                ? 'bg-destructive/10 border border-destructive/20 text-destructive'
                : 'bg-primary/10 border border-primary/20 text-primary'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Product Form */}
        {productData.barcode && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {existingProduct ? 'Edit Product' : 'New Product'}
                </h3>
                {existingProduct && (
                  <Badge variant="secondary">
                    <Edit className="w-3 h-3 mr-1" />
                    Existing
                  </Badge>
                )}
                {!existingProduct && (
                  <Badge variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Barcode</Label>
                  <Input
                    type="text"
                    value={productData.barcode}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label>Product Name *</Label>
                  <Input
                    type="text"
                    value={productData.name}
                    onChange={(e: any) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.price || ''}
                    onChange={(e: any) => setProductData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <select
                    value={productData.category}
                    onChange={(e: any) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
                  >
                    <option value="">Select category</option>
                    <option value="Produce">Produce</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat & Seafood</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Health">Health & Beauty</option>
                    <option value="Household">Household</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={productData.inStock}
                    onChange={(e: any) => setProductData(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={saveProduct}
                  disabled={loading || !productData.name || productData.price <= 0}
                  className="flex-1 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {existingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                
                <Button
                  onClick={clearForm}
                  variant="outline"
                  className="px-6"
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};