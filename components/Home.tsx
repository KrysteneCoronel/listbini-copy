import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronDown, Search, ShoppingBag, Plus } from 'lucide-react';
import { CartItem } from '../App';

interface Props {
  onScanClick: () => void;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  cartItemCount: number;
}

const FEATURED_PRODUCTS = [
  {
    barcode: '1234567890123',
    name: 'Orange Package 1',
    description: '1 bundle',
    price: 325,
    color: '#2a4ba0'
  },
  {
    barcode: '2345678901234',
    name: 'Green Tea Package 2',
    description: '1 bundle',
    price: 89,
    color: '#2a4ba0'
  },
  {
    barcode: '3456789012345',
    name: 'Orange Package 1',
    description: '1 bundle',
    price: 325,
    color: '#ffc83a'
  },
  {
    barcode: '4567890123456',
    name: 'Green Tea Package 2',
    description: '1 bundle',
    price: 89,
    color: '#ffc83a'
  },
];

export function Home({ onScanClick, onAddToCart, cartItemCount }: Props) {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-b-3xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-4 w-32 h-32 bg-accent/20 rounded-full"></div>
        <div className="absolute top-40 left-4 w-20 h-20 bg-primary-foreground/10 rounded-full"></div>
        
        <div className="relative z-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold">Hey, Halal</h1>
            </div>
            <button className="relative">
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="bg-input-background rounded-full p-4 flex items-center gap-3">
              <Search className="w-4 h-4 text-primary-foreground/60" />
              <input
                type="text"
                placeholder="Search Products or store"
                className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 flex-1 outline-none"
              />
            </div>
          </div>

          {/* Delivery Info */}
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xs text-primary-foreground/60 uppercase tracking-wider mb-1">
                Delivery to
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">Green Way 3000, Sylhet</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div>
              <p className="text-xs text-primary-foreground/60 uppercase tracking-wider mb-1">
                Within
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">1 Hour</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-4 -mt-16 relative z-20">
        <Card className="p-4 bg-accent text-accent-foreground">
          <div className="space-y-1">
            <p className="text-2xl font-extrabold">
              346 <span className="text-base font-light">USD</span>
            </p>
            <p className="text-sm font-medium">Your total savings</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-muted text-muted-foreground">
          <div className="space-y-1">
            <p className="text-2xl font-extrabold">
              215 <span className="text-base font-light">HRS</span>
            </p>
            <p className="text-sm font-medium">Your time saved</p>
          </div>
        </Card>
      </div>

      {/* Deals Section */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Deals on Fruits & Tea</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {FEATURED_PRODUCTS.map((product, index) => (
            <Card key={index} className="p-0 overflow-hidden">
              <div className="bg-secondary p-4 h-32 flex items-center justify-center relative">
                {/* Placeholder for product image */}
                <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold">${product.price}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.name} | {product.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onAddToCart({
                      barcode: product.barcode,
                      name: product.name,
                      price: product.price
                    })}
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: product.color }}
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Scan Button */}
        <Button
          onClick={onScanClick}
          className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
        >
          <Search className="w-5 h-5 mr-2" />
          Scan Barcode
        </Button>
      </div>
    </div>
  );
}