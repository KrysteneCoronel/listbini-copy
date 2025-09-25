import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Search, Tag, Edit, Trash2, Plus, Calendar, Percent, DollarSign, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  targetType: 'product' | 'category' | 'all';
  targetValue?: string; // barcode for product, category name for category
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  usageCount?: number;
}

export const AdminPromotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'expired'>('all');
  const [loading, setLoading] = useState(true);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, 'id' | 'createdAt' | 'usageCount'>>({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    targetType: 'all',
    targetValue: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  const categories = [
    'Produce', 'Dairy', 'Meat', 'Bakery', 'Frozen', 
    'Pantry', 'Beverages', 'Snacks', 'Health', 'Household'
  ];

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/promotions`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(data.promotions || []);
      } else {
        console.error('Failed to load promotions');
      }
    } catch (error) {
      console.error('Load promotions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPromotionExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'active') {
      matchesFilter = promotion.isActive && !isPromotionExpired(promotion.endDate);
    } else if (filterType === 'expired') {
      matchesFilter = !promotion.isActive || isPromotionExpired(promotion.endDate);
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleCreatePromotion = async () => {
    if (!newPromotion.title || !newPromotion.description || newPromotion.discountValue <= 0) {
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/promotion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPromotion),
      });

      if (response.ok) {
        await loadPromotions();
        setIsCreateDialogOpen(false);
        setNewPromotion({
          title: '',
          description: '',
          discountType: 'percentage',
          discountValue: 0,
          targetType: 'all',
          targetValue: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isActive: true,
        });
      } else {
        console.error('Failed to create promotion');
      }
    } catch (error) {
      console.error('Create promotion error:', error);
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion({ ...promotion });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePromotion = async () => {
    if (!editingPromotion) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/promotion`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPromotion),
      });

      if (response.ok) {
        await loadPromotions();
        setIsEditDialogOpen(false);
        setEditingPromotion(null);
      } else {
        console.error('Failed to update promotion');
      }
    } catch (error) {
      console.error('Update promotion error:', error);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert('Confirm', 'Are you sure you want to delete this promotion?', [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'OK', onPress: () => resolve(true) },
      ]);
    });
    if (!confirmed) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/promotion/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        await loadPromotions();
      } else {
        console.error('Failed to delete promotion');
      }
    } catch (error) {
      console.error('Delete promotion error:', error);
    }
  };

  const togglePromotionStatus = async (promotion: Promotion) => {
    const updatedPromotion = { ...promotion, isActive: !promotion.isActive };
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/promotion`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPromotion),
      });

      if (response.ok) {
        await loadPromotions();
      }
    } catch (error) {
      console.error('Toggle promotion error:', error);
    }
  };

  const formatDiscount = (promotion: Promotion) => {
    if (promotion.discountType === 'percentage') {
      return `${promotion.discountValue}% OFF`;
    } else {
      return `$${promotion.discountValue.toFixed(2)} OFF`;
    }
  };

  const getPromotionStatus = (promotion: Promotion) => {
    if (!promotion.isActive) return { text: 'Inactive', variant: 'secondary' as const };
    if (isPromotionExpired(promotion.endDate)) return { text: 'Expired', variant: 'destructive' as const };
    if (new Date(promotion.startDate) > new Date()) return { text: 'Scheduled', variant: 'outline' as const };
    return { text: 'Active', variant: 'default' as const };
  };

  if (loading) {
    return (
      <div className="pb-24">
        <div className="px-6 pt-12 pb-6 bg-background">
          <h1 className="text-3xl font-bold text-foreground">Promotions</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Promotions</h1>
            <p className="text-base text-muted-foreground mt-1">
              Manage discounts and special offers
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-success hover:bg-success/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Promo
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Search and Filter */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e: any) => setFilterType(e.target.value as any)}
                className="flex-1 p-2 border border-border/50 rounded-lg bg-input text-foreground text-sm"
              >
                <option value="all">All Promotions</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired/Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{promotions.length}</p>
            <p className="text-xs text-muted-foreground">Total Promos</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-success">
              {promotions.filter(p => p.isActive && !isPromotionExpired(p.endDate)).length}
            </p>
            <p className="text-xs text-muted-foreground">Active</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-warning">
              {promotions.filter(p => new Date(p.startDate) > new Date()).length}
            </p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </Card>
        </div>

        {/* Promotions List */}
        <div className="space-y-3">
          {filteredPromotions.length === 0 ? (
            <Card className="p-8 text-center">
              <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                {searchTerm || filterType !== 'all' ? 'No promotions found' : 'No promotions yet'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first promotion to boost sales'
                }
              </p>
              {(!searchTerm && filterType === 'all') && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Promotion
                </Button>
              )}
            </Card>
          ) : (
            filteredPromotions.map((promotion) => {
              const status = getPromotionStatus(promotion);
              return (
                <Card key={promotion.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{promotion.title}</h3>
                          <Badge variant={status.variant} className="text-xs">
                            {status.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{promotion.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {promotion.discountType === 'percentage' ? (
                              <Percent className="w-3 h-3" />
                            ) : (
                              <DollarSign className="w-3 h-3" />
                            )}
                            <span className="font-medium text-success">{formatDiscount(promotion)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-3">
                        <Button
                          onClick={() => togglePromotionStatus(promotion)}
                          variant="outline"
                          size="sm"
                          className={`w-8 h-8 p-0 ${
                            promotion.isActive ? 'text-success hover:bg-success hover:text-success-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEditPromotion(promotion)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeletePromotion(promotion.id)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Target: {promotion.targetType === 'all' ? 'All Products' : 
                                  promotion.targetType === 'category' ? `${promotion.targetValue} Category` : 
                                  'Specific Product'}
                        </span>
                        {promotion.usageCount !== undefined && (
                          <span className="text-muted-foreground">
                            Used: {promotion.usageCount} times
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Create Promotion Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label>Promotion Title</Label>
              <Input
                type="text"
                value={newPromotion.title}
                onChange={(e: any) => setNewPromotion(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Weekend Special"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={newPromotion.description}
                onChange={(e: any) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the promotion..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Discount Type</Label>
                <select
                  value={newPromotion.discountType}
                  onChange={(e: any) => setNewPromotion(prev => ({ ...prev, discountType: e.target.value as any }))}
                  className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPromotion.discountValue || ''}
                  onChange={(e: any) => setNewPromotion(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                  placeholder={newPromotion.discountType === 'percentage' ? '10' : '5.00'}
                />
              </div>
            </div>

            <div>
              <Label>Apply To</Label>
              <select
                value={newPromotion.targetType}
                onChange={(e: any) => setNewPromotion(prev => ({ ...prev, targetType: e.target.value as any, targetValue: '' }))}
                className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
              >
                <option value="all">All Products</option>
                <option value="category">Specific Category</option>
                <option value="product">Specific Product</option>
              </select>
            </div>

            {newPromotion.targetType === 'category' && (
              <div>
                <Label>Category</Label>
                <select
                  value={newPromotion.targetValue}
                  onChange={(e: any) => setNewPromotion(prev => ({ ...prev, targetValue: e.target.value }))}
                  className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}

            {newPromotion.targetType === 'product' && (
              <div>
                <Label>Product Barcode</Label>
                <Input
                  type="text"
                  value={newPromotion.targetValue || ''}
                onChange={(e: any) => setNewPromotion(prev => ({ ...prev, targetValue: e.target.value }))}
                  placeholder="Enter product barcode"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newPromotion.startDate}
                onChange={(e: any) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newPromotion.endDate}
                onChange={(e: any) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="createActive"
                checked={newPromotion.isActive}
                onChange={(e: any) => setNewPromotion(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <Label htmlFor="createActive">Start promotion immediately</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreatePromotion}
              disabled={!newPromotion.title || !newPromotion.description || newPromotion.discountValue <= 0}
              className="flex-1 bg-success hover:bg-success/90"
            >
              Create Promotion
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
          </DialogHeader>
          
          {editingPromotion && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label>Promotion Title</Label>
                <Input
                  type="text"
                  value={editingPromotion.title}
                onChange={(e: any) => setEditingPromotion(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingPromotion.description}
                onChange={(e: any) => setEditingPromotion(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Discount Type</Label>
                  <select
                    value={editingPromotion.discountType}
                    onChange={(e: any) => setEditingPromotion(prev => 
                      prev ? { ...prev, discountType: e.target.value as any } : null
                    )}
                    className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingPromotion.discountValue}
                    onChange={(e: any) => setEditingPromotion(prev => 
                      prev ? { ...prev, discountValue: parseFloat(e.target.value) || 0 } : null
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={editingPromotion.startDate}
                    onChange={(e: any) => setEditingPromotion(prev => 
                      prev ? { ...prev, startDate: e.target.value } : null
                    )}
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={editingPromotion.endDate}
                    onChange={(e: any) => setEditingPromotion(prev => 
                      prev ? { ...prev, endDate: e.target.value } : null
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={editingPromotion.isActive}
                  onChange={(e: any) => setEditingPromotion(prev => 
                    prev ? { ...prev, isActive: e.target.checked } : null
                  )}
                  className="w-4 h-4"
                />
                <Label htmlFor="editActive">Active</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdatePromotion}
                  className="flex-1"
                >
                  Update Promotion
                </Button>
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};