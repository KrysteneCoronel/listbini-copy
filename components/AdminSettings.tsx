import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { LogOut, User, Shield, Database, Package, BarChart3 } from 'lucide-react';
import { useAuth } from './AuthContext';

export const AdminSettings: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-base text-muted-foreground mt-1">
          Employee dashboard settings
        </p>
      </div>

      <div className="px-4 space-y-6">
        {/* Admin Profile */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">Employee ID: {user?.id}</p>
              <p className="text-xs text-blue-600 font-medium">Administrator Access</p>
            </div>
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 p-3 rounded-lg text-center">
              <Package className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg text-center">
              <BarChart3 className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">98%</p>
              <p className="text-xs text-muted-foreground">In Stock</p>
            </div>
          </div>
        </Card>

        {/* Admin Actions */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Admin Actions</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <Database className="w-4 h-4" />
              Export Inventory Data
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <Package className="w-4 h-4" />
              Bulk Import Products
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <BarChart3 className="w-4 h-4" />
              Generate Reports
            </Button>
          </div>
        </Card>

        {/* System Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">System Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Version</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Status</span>
              <span className="text-success">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Sync</span>
              <span className="text-foreground">Just now</span>
            </div>
          </div>
        </Card>

        {/* Help & Support */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Help & Support</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              Admin Manual
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              Contact IT Support
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              Report Issue
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};