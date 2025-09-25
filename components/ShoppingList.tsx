import React from 'react';
import { Button } from './ui/button';
import { Minus, Plus, Trash2, Star } from 'lucide-react';
import { CartItem } from '../App';

interface Props {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onToggleFavorite: (id: string) => void;
}

export function ShoppingList({ items, onRemoveItem, onUpdateQuantity, onToggleFavorite }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="px-4 space-y-4">
      <h2 className="text-xl font-semibold px-4">Items</h2>
      
      <div className="bg-card mx-4 overflow-hidden rounded-xl shadow-sm divide-y divide-border/50">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="p-4"
          >
            <div className="flex items-center gap-4">
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {item.barcode}
                  </span>
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => onToggleFavorite(item.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  item.isFavorite
                    ? 'text-warning bg-warning/10'
                    : 'text-muted-foreground hover:text-warning hover:bg-warning/10'
                }`}
              >
                <Star 
                  className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} 
                />
              </button>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-secondary rounded-full">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="w-8 text-center font-medium text-foreground">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-[70px]">
                  <p className="font-semibold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}