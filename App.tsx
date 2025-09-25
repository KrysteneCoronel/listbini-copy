import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { TabNavigation } from './components/TabNavigation';
import { AdminTabNavigation } from './components/AdminTabNavigation';
import { BarcodeScanner } from './components/BarcodeScanner';
import { AdminProductScanner } from './components/AdminProductScanner';
import { AdminInventory } from './components/AdminInventory';
import { AdminSettings } from './components/AdminSettings';
import { ShoppingList } from './components/ShoppingList';
import { CartTotal } from './components/CartTotal';
import { PriceComparison } from './components/PriceComparison';
import { ShoppingLists } from './components/ShoppingLists';
import { Settings } from './components/Settings';
import { projectId, publicAnonKey } from './utils/supabase/info';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  barcode: string;
  quantity: number;
  isFavorite?: boolean;
}

const GroceryApp: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<CartItem[]>([]);
  const [totalSpent, setTotalSpent] = useState(1247.50); // Mock total spending across all time
  const [activeTab, setActiveTab] = useState('cart');
  const [adminActiveTab, setAdminActiveTab] = useState('scan');
  
  const { user, loading } = useAuth();

  // Initialize demo data when component mounts
  React.useEffect(() => {
    const initDemoData = async () => {
      try {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/init-demo-data`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.log('Demo data initialization error:', error);
      }
    };

    initDemoData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Admin Interface
  if (user.role === 'admin') {
    const renderAdminContent = () => {
      switch (adminActiveTab) {
        case 'scan':
          return <AdminProductScanner />;
        case 'inventory':
          return <AdminInventory />;
        case 'settings':
          return <AdminSettings />;
        default:
          return <AdminProductScanner />;
      }
    };

    return (
      <div className="min-h-screen bg-background">
        {/* iOS-style status bar spacing */}
        <div className="h-11 bg-background"></div>
        
        <div className="max-w-md mx-auto relative">
          {renderAdminContent()}
          
          <AdminTabNavigation
            activeTab={adminActiveTab}
            onTabChange={setAdminActiveTab}
          />
        </div>
      </div>
    );
  }

  // User Interface (existing functionality)
  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.barcode === item.barcode);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.barcode === item.barcode
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, id: Date.now().toString(), quantity: 1 }];
    });
    setActiveTab('cart');
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const toggleFavorite = (id: string) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, isFavorite: !item.isFavorite };
          
          // Add to or remove from favorites
          if (updatedItem.isFavorite) {
            setFavorites(prevFavorites => {
              const existingFavorite = prevFavorites.find(fav => fav.barcode === item.barcode);
              if (!existingFavorite) {
                return [...prevFavorites, { ...updatedItem, quantity: 1 }];
              }
              return prevFavorites;
            });
          } else {
            setFavorites(prevFavorites => 
              prevFavorites.filter(fav => fav.barcode !== item.barcode)
            );
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'cart':
        return (
          <div className="pb-24">
            {/* iOS-style large header */}
            <div className="px-6 pt-12 pb-6 bg-background">
              <h1 className="text-3xl font-bold text-foreground">Cart</h1>
              {cartItemCount > 0 && (
                <p className="text-base text-muted-foreground mt-1">
                  {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in your cart
                </p>
              )}
            </div>
            
            {cartItems.length > 0 ? (
              <>
                <CartTotal total={total} itemCount={cartItems.length} />
                <ShoppingList 
                  items={cartItems}
                  onRemoveItem={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  onToggleFavorite={toggleFavorite}
                />
              </>
            ) : (
              <div className="px-4">
                <div className="bg-card mx-4 p-12 text-center rounded-xl shadow-sm">
                  <div className="w-20 h-20 bg-muted/50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Use the scanner to add items by barcode
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'scan':
        return (
          <BarcodeScanner 
            onItemScanned={addToCart}
            onClose={() => setActiveTab('cart')}
          />
        );
      
      case 'compare':
        return <PriceComparison />;
      
      case 'lists':
        return <ShoppingLists favorites={favorites} />;
      
      case 'settings':
        return <Settings totalSpent={totalSpent} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS-style status bar spacing */}
      <div className="h-11 bg-background"></div>
      
      <div className="max-w-md mx-auto relative">
        {renderContent()}
        
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cartItemCount={cartItemCount}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <GroceryApp />
    </AuthProvider>
  );
}