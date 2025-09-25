import React from 'react';
import { ShoppingCart, BarChart3, List, Settings, Scan } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
}

export function TabNavigation({ activeTab, onTabChange, cartItemCount }: Props) {
  const tabs = [
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartItemCount },
    { id: 'scan', label: 'Scan', icon: Scan },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'lists', label: 'Lists', icon: List },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* iOS-style backdrop blur effect */}
      <div className="bg-card/80 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-[60px] relative transition-all duration-200 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <Icon 
                    className={`w-6 h-6 transition-all duration-200 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {tab.badge && tab.badge > 0 && (
                    <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-semibold">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </div>
                  )}
                </div>
                
                <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Safe area spacing for iOS devices */}
        <div className="h-6 md:h-0"></div>
      </div>
    </div>
  );
}