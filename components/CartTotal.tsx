import React from 'react';

interface Props {
  total: number;
  itemCount: number;
}

export function CartTotal({ total, itemCount }: Props) {
  if (itemCount === 0) return null;

  return (
    <div className="bg-card mx-4 p-4 mb-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Total</h3>
          <p className="text-sm text-muted-foreground">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-foreground">
            ${total.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            ${(total / itemCount).toFixed(2)} avg
          </p>
        </div>
      </div>
      
      <button className="w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold min-h-[44px] flex items-center justify-center">
        Proceed to Checkout
      </button>
    </div>
  );
}