import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Settings as SettingsIcon, Award, Crown, Star, Trophy, Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthContext';

interface LoyaltyTier {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  minSpent: number;
  maxSpent?: number;
  benefits: string[];
}

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  currency: string;
  defaultStore: string;
}

interface Props {
  totalSpent: number;
}

const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    icon: Award,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    minSpent: 0,
    maxSpent: 500,
    benefits: ['Basic rewards', 'Birthday discount']
  },
  {
    name: 'Silver',
    icon: Star,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    minSpent: 500,
    maxSpent: 1500,
    benefits: ['5% cashback', 'Early sale access', 'Free shipping']
  },
  {
    name: 'Gold',
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    minSpent: 1500,
    maxSpent: 3000,
    benefits: ['10% cashback', 'Priority support', 'Exclusive products']
  },
  {
    name: 'Platinum',
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    minSpent: 3000,
    benefits: ['15% cashback', 'Personal shopper', 'VIP events', 'Premium support']
  }
];

export function Settings({ totalSpent }: Props) {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    darkMode: false,
    notifications: true,
    currency: 'USD',
    defaultStore: 'Any Store',
  });

  const { user, signOut } = useAuth();

  const updateAppSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Determine current tier and progress
  const getCurrentTier = () => {
    return LOYALTY_TIERS.find(tier => 
      totalSpent >= tier.minSpent && (tier.maxSpent === undefined || totalSpent < tier.maxSpent)
    ) || LOYALTY_TIERS[0];
  };

  const getNextTier = () => {
    const currentTierIndex = LOYALTY_TIERS.findIndex(tier => 
      totalSpent >= tier.minSpent && (tier.maxSpent === undefined || totalSpent < tier.maxSpent)
    );
    return currentTierIndex < LOYALTY_TIERS.length - 1 ? LOYALTY_TIERS[currentTierIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier = nextTier 
    ? ((totalSpent - currentTier.minSpent) / (nextTier.minSpent - currentTier.minSpent)) * 100
    : 100;

  return (
    <div className="pb-24">
      {/* iOS-style large header */}
      <div className="px-6 pt-12 pb-6 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="px-4 space-y-6">
        {/* User Profile */}
        <div className="bg-card mx-4 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role} Account
              </p>
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
        </div>

        {/* Shop Loyalty */}
        <div className="bg-card mx-4 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 ${currentTier.bgColor} rounded-full flex items-center justify-center`}>
              <currentTier.icon className={`w-4 h-4 ${currentTier.color}`} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Shop Loyalty</h2>
          </div>

          <div className="space-y-4">
            {/* Current Status */}
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 ${currentTier.bgColor} rounded-full flex items-center justify-center mx-auto`}>
                <currentTier.icon className={`w-8 h-8 ${currentTier.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{currentTier.name} Member</h3>
                <p className="text-sm text-muted-foreground">Total spent: ${totalSpent.toFixed(2)}</p>
              </div>
            </div>

            {nextTier && (
              <>
                <Separator />
                
                {/* Progress to Next Tier */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Progress to {nextTier.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${(nextTier.minSpent - totalSpent).toFixed(2)} to go
                    </span>
                  </div>
                  <Progress value={progressToNextTier} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Spend ${nextTier.minSpent.toFixed(2)} total to unlock {nextTier.name} tier
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Current Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Your Benefits</h4>
              <div className="space-y-2">
                {currentTier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {nextTier && (
              <>
                <Separator />
                
                {/* Next Tier Benefits */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Unlock at {nextTier.name}</h4>
                  <div className="space-y-2">
                    {nextTier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tier Overview */}
        <div className="bg-card mx-4 p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">All Tiers</h2>
          
          <div className="space-y-3">
            {LOYALTY_TIERS.map((tier, index) => {
              const isCurrent = tier.name === currentTier.name;
              const isUnlocked = totalSpent >= tier.minSpent;
              
              return (
                <div
                  key={tier.name}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isCurrent 
                      ? 'border-primary bg-primary/5' 
                      : isUnlocked 
                        ? 'border-border bg-muted/30' 
                        : 'border-border bg-background'
                  }`}
                >
                  <div className={`w-8 h-8 ${tier.bgColor} rounded-full flex items-center justify-center`}>
                    <tier.icon className={`w-4 h-4 ${tier.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {tier.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tier.maxSpent 
                        ? `$${tier.minSpent} - $${tier.maxSpent}` 
                        : `$${tier.minSpent}+`
                      }
                    </p>
                  </div>
                  {isUnlocked && (
                    <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                      <span className="text-success-foreground text-xs">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-card mx-4 p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">App Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {appSettings.darkMode ? (
                    <Moon className="w-4 h-4 text-primary" />
                  ) : (
                    <Sun className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div>
                  <Label className="text-foreground">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch to dark theme
                  </p>
                </div>
              </div>
              <Switch
                checked={appSettings.darkMode}
                onCheckedChange={(checked: any) =>
                  updateAppSetting('darkMode', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <Label className="text-foreground">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive app notifications
                  </p>
                </div>
              </div>
              <Switch
                checked={appSettings.notifications}
                onCheckedChange={(checked: any) =>
                  updateAppSetting('notifications', checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Default Currency</Label>
              <select
                value={appSettings.currency}
                onChange={(e: any) => updateAppSetting('currency', e.target.value)}
                className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Default Store</Label>
              <select
                value={appSettings.defaultStore}
                onChange={(e: any) => updateAppSetting('defaultStore', e.target.value)}
                className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
              >
                <option value="Any Store">Any Store</option>
                <option value="Walmart">Walmart</option>
                <option value="Target">Target</option>
                <option value="Kroger">Kroger</option>
                <option value="Whole Foods">Whole Foods</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loyalty Stats */}
        <div className="grid grid-cols-2 gap-4 px-4">
          <div className="bg-success text-success-foreground p-4 rounded-xl shadow-sm">
            <div className="space-y-1">
              <p className="text-2xl font-bold">${totalSpent.toFixed(0)}</p>
              <p className="text-sm opacity-90">Total spent</p>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-xl shadow-sm">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {nextTier ? `${Math.round(progressToNextTier)}%` : '100%'}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextTier ? `To ${nextTier.name}` : 'Max tier'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}