import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Input } from './ui/input';
import { Search, Package, Scan } from 'lucide-react';
import { CartItem } from '../App';

interface Props {
  onItemScanned: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  onClose: () => void;
}

const MOCK_PRODUCTS = [
  { barcode: '1234567890123', name: 'Milk (1L)', price: 3.99 },
  { barcode: '2345678901234', name: 'Bread (Whole Wheat)', price: 2.49 },
  { barcode: '3456789012345', name: 'Bananas (1lb)', price: 1.29 },
  { barcode: '4567890123456', name: 'Chicken Breast (1lb)', price: 6.99 },
  { barcode: '5678901234567', name: 'Orange Juice (64oz)', price: 4.99 },
  { barcode: '6789012345678', name: 'Yogurt (Greek)', price: 1.99 },
  { barcode: '7890123456789', name: 'Apples (2lbs)', price: 3.49 },
  { barcode: '8901234567890', name: 'Pasta (1lb)', price: 1.79 },
  { barcode: '9012345678901', name: 'Tomato Sauce', price: 2.29 },
  { barcode: '0123456789012', name: 'Cheese (Cheddar)', price: 4.49 },
];

export function BarcodeScanner({ onItemScanned, onClose }: Props) {
  const [barcode, setBarcode] = useState('');
  const [searchResults, setSearchResults] = useState(MOCK_PRODUCTS);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = MOCK_PRODUCTS.find(p => p.barcode === barcode);
    if (product) {
      onItemScanned(product);
      setBarcode('');
    } else {
      Alert.alert('Not found', 'Product not found. Try a different barcode.');
    }
  };

  const handleSearch = (query: string) => {
    setBarcode(query);
    if (query.length > 0) {
      const filtered = MOCK_PRODUCTS.filter(
        product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.barcode.includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(MOCK_PRODUCTS);
    }
  };

  const selectProduct = (product: typeof MOCK_PRODUCTS[0]) => {
    onItemScanned(product);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 py-6 bg-background">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Scan className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Scanner</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleBarcodeSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products or enter barcode"
              value={barcode}
              onChange={(e: any) => handleSearch(e.target.value)}
              className="pl-11 pr-4 py-3 bg-input border border-border/50 rounded-xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </form>
      </div>

      {/* Camera Placeholder */}
      <div className="mx-4 mb-6">
        <div className="bg-card mx-4 p-8 text-center rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-muted/50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Camera Scanner</h3>
          <p className="text-sm text-muted-foreground mb-1">
            Point your camera at a barcode
          </p>
          <p className="text-xs text-muted-foreground">
            Use search above for demo
          </p>
        </div>
      </div>

      {/* Product Results */}
      <div className="px-4">
        <h2 className="text-xl font-semibold mb-4 px-2">Products</h2>
        
        <div className="bg-card mx-4 overflow-hidden rounded-xl shadow-sm divide-y divide-border/50">
          {searchResults.map((product, index) => (
            <button
              key={product.barcode}
              onClick={() => selectProduct(product)}
              className={`w-full p-4 text-left hover:bg-muted/30 transition-colors ${
                index === 0 ? 'rounded-t-xl' : ''
              } ${index === searchResults.length - 1 ? 'rounded-b-xl' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.barcode}
                  </p>
                </div>
                
                <div className="text-right ml-4">
                  <p className="font-semibold text-foreground">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="px-3 py-1 mt-2 bg-primary/10 text-primary text-sm rounded-full font-medium">
                    Add
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {searchResults.length === 0 && (
          <div className="bg-card mx-4 p-8 text-center rounded-xl shadow-sm">
            <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="font-medium text-foreground">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}