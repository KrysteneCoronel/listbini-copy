import React from 'react';
import { ScanLine, Package, Settings } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminTabNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'scan', label: 'Scan Product', icon: ScanLine },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        {/* Background with blur effect */}
        <div className="bg-card/95 backdrop-blur-xl border-t border-border">
          <div className="px-2 py-2">
            <div className="flex items-center justify-around">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 mx-1 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                    <span className={`text-xs font-medium truncate ${isActive ? 'text-primary-foreground' : ''}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Safe area for iPhone home indicator */}
          <div className="h-safe-bottom bg-card/95"></div>
        </div>
      </div>
    </div>
  );
};