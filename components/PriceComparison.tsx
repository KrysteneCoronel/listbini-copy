import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface ComparisonItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  pricePerUnit: string;
  store: string;
  savings?: number;
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    id: '1',
    name: 'Milk',
    brand: 'Organic Valley',
    size: '1 Gallon',
    price: 5.99,
    pricePerUnit: '$5.99/gal',
    store: 'Whole Foods',
  },
  {
    id: '2',
    name: 'Milk',
    brand: 'Great Value',
    size: '1 Gallon',
    price: 3.48,
    pricePerUnit: '$3.48/gal',
    store: 'Walmart',
    savings: 2.51,
  },
  {
    id: '3',
    name: 'Milk',
    brand: 'Organic Valley',
    size: '0.5 Gallon',
    price: 3.29,
    pricePerUnit: '$6.58/gal',
    store: 'Target',
  },
  {
    id: '4',
    name: 'Bread',
    brand: 'Wonder',
    size: '20oz',
    price: 2.48,
    pricePerUnit: '$1.98/lb',
    store: 'Kroger',
  },
  {
    id: '5',
    name: 'Bread',
    brand: 'Dave\'s Killer',
    size: '27oz',
    price: 4.99,
    pricePerUnit: '$2.96/lb',
    store: 'Whole Foods',
  },
];

export function PriceComparison() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(COMPARISON_DATA);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = COMPARISON_DATA.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.brand.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(COMPARISON_DATA);
    }
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {} as Record<string, ComparisonItem[]>);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-background">
        <h1 className="text-3xl font-bold text-foreground mb-6">Price Comparison</h1>
        
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search products to compare..."
            value={searchQuery}
            onChange={(e: any) => handleSearch(e.target.value)}
            className="flex-1"
          />
          <Button size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {Object.entries(groupedItems).map(([productName, items]) => (
          <div key={productName} className="space-y-3">
            <h2 className="text-lg font-medium text-foreground px-2">{productName}</h2>
            
            {items
              .sort((a, b) => a.price - b.price)
              .map((item, index) => (
                <div key={item.id} className="bg-card mx-4 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{item.brand}</h3>
                        {index === 0 && (
                          <div className="bg-success text-success-foreground px-2 py-0.5 rounded text-xs font-medium">
                            Best Deal
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.size} • {item.store}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {item.pricePerUnit}
                        </span>
                        
                        {item.savings && (
                          <div className="flex items-center gap-1 text-xs text-success">
                            <TrendingDown className="w-3 h-3" />
                            Save ${item.savings.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${item.price.toFixed(2)}
                      </p>
                      
                      {index > 0 && (
                        <div className="flex items-center gap-1 text-xs text-destructive">
                          <TrendingUp className="w-3 h-3" />
                          +${(item.price - items[0].price).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="bg-card mx-4 p-12 text-center rounded-xl shadow-sm">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="font-medium text-foreground">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching for a different product</p>
          </div>
        )}
      </div>
    </div>
  );
}