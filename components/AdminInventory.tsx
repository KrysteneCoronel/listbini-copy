import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Search, Package, Edit, Trash2, Plus, Filter, Percent, DollarSign, Tag, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Product {
  barcode: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    active: boolean;
  };
}

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [discountingProduct, setDiscountingProduct] = useState<Product | null>(null);

  const categories = [
    'Produce', 'Dairy', 'Meat', 'Bakery', 'Frozen', 
    'Pantry', 'Beverages', 'Snacks', 'Health', 'Household'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/products`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Failed to load products');
      }
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmAsync = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert('Confirm', message, [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'OK', onPress: () => resolve(true) },
      ]);
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/product`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      if (response.ok) {
        await loadProducts();
        setIsEditDialogOpen(false);
        setEditingProduct(null);
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Update product error:', error);
    }
  };

  const handleDeleteProduct = async (barcode: string) => {
    if (!(await confirmAsync('Are you sure you want to delete this product?'))) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/product/${barcode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        await loadProducts();
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product error:', error);
    }
  };

  const handleAddDiscount = (product: Product) => {
    setDiscountingProduct({
      ...product,
      discount: product.discount || { type: 'percentage', value: 0, active: true }
    });
    setIsDiscountDialogOpen(true);
  };

  const handleUpdateDiscount = async () => {
    if (!discountingProduct) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/product`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discountingProduct),
      });

      if (response.ok) {
        await loadProducts();
        setIsDiscountDialogOpen(false);
        setDiscountingProduct(null);
      } else {
        console.error('Failed to update discount');
      }
    } catch (error) {
      console.error('Update discount error:', error);
    }
  };

  const handleRemoveDiscount = async (product: Product) => {
    const updatedProduct = { ...product };
    delete updatedProduct.discount;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0b34730b/admin/product`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        await loadProducts();
      } else {
        console.error('Failed to remove discount');
      }
    } catch (error) {
      console.error('Remove discount error:', error);
    }
  };

  const calculateDiscountedPrice = (product: Product) => {
    if (!product.discount || !product.discount.active) return product.price;
    
    if (product.discount.type === 'percentage') {
      return product.price * (1 - product.discount.value / 100);
    } else {
      return Math.max(0, product.price - product.discount.value);
    }
  };

  const formatDiscount = (discount: { type: 'percentage' | 'fixed'; value: number }) => {
    if (discount.type === 'percentage') {
      return `${discount.value}% OFF`;
    } else {
      return `$${discount.value.toFixed(2)} OFF`;
    }
  };

  if (loading) {
    return (
      <div className="pb-24">
        <div className="px-6 pt-12 pb-6 bg-background">
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-background">
        <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
        <p className="text-base text-muted-foreground mt-1">
          Manage products and discounts
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Search and Filter */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products by name or barcode..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e: any) => setSelectedCategory(e.target.value)}
                className="flex-1 p-2 border border-border/50 rounded-lg bg-input text-foreground text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{products.length}</p>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-success">{products.filter(p => p.inStock).length}</p>
            <p className="text-xs text-muted-foreground">In Stock</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-warning">{products.filter(p => p.discount?.active).length}</p>
            <p className="text-xs text-muted-foreground">On Sale</p>
          </Card>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                {searchTerm || selectedCategory ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filters' 
                  : 'Use the scanner to add your first product'
                }
              </p>
            </Card>
          ) : (
            filteredProducts.map((product) => {
              const discountedPrice = calculateDiscountedPrice(product);
              const hasActiveDiscount = product.discount?.active;
              
              return (
                <Card key={product.barcode} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {product.name}
                        </h3>
                        <Badge 
                          variant={product.inStock ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        {hasActiveDiscount && (
                          <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                            <Tag className="w-3 h-3 mr-1" />
                            {formatDiscount(product.discount!)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {product.barcode} • {product.category || 'No category'}
                      </p>
                      <div className="flex items-center gap-2">
                        {hasActiveDiscount ? (
                          <>
                            <p className="text-sm text-muted-foreground line-through">
                              ${product.price.toFixed(2)}
                            </p>
                            <p className="text-lg font-bold text-success">
                              ${discountedPrice.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-foreground">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {product.discount ? (
                        <Button
                          onClick={() => handleAddDiscount(product)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 text-warning hover:bg-warning hover:text-warning-foreground"
                        >
                          <Tag className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleAddDiscount(product)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 text-success hover:bg-success hover:text-success-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleEditProduct(product)}
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.barcode)}
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e: any) => setEditingProduct(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                />
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingProduct.price}
                  onChange={(e: any) => setEditingProduct(prev => 
                    prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null
                  )}
                />
              </div>

              <div>
                <Label>Category</Label>
                <select
                  value={editingProduct.category}
                  onChange={(e: any) => setEditingProduct(prev => 
                    prev ? { ...prev, category: e.target.value } : null
                  )}
                  className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editInStock"
                  checked={editingProduct.inStock}
                  onChange={(e: any) => setEditingProduct(prev => 
                    prev ? { ...prev, inStock: e.target.checked } : null
                  )}
                  className="w-4 h-4"
                />
                <Label htmlFor="editInStock">In Stock</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdateProduct}
                  className="flex-1"
                >
                  Update Product
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

      {/* Add/Edit Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {discountingProduct?.discount ? 'Edit Discount' : 'Add Discount'}
            </DialogTitle>
          </DialogHeader>
          
          {discountingProduct && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-semibold text-foreground">{discountingProduct.name}</p>
                <p className="text-sm text-muted-foreground">Regular Price: ${discountingProduct.price.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Discount Type</Label>
                  <select
                    value={discountingProduct.discount?.type || 'percentage'}
                    onChange={(e: any) => setDiscountingProduct(prev => 
                      prev ? { 
                        ...prev, 
                        discount: { 
                          ...prev.discount!, 
                          type: e.target.value as 'percentage' | 'fixed' 
                        } 
                      } : null
                    )}
                    className="w-full p-3 border border-border/50 rounded-xl bg-input text-foreground"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <Label>Discount Value</Label>
                  <div className="relative">
                    {discountingProduct.discount?.type === 'percentage' ? (
                      <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    )}
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max={discountingProduct.discount?.type === 'percentage' ? 100 : discountingProduct.price}
                      value={discountingProduct.discount?.value || ''}
                      onChange={(e: any) => setDiscountingProduct(prev => 
                        prev ? { 
                          ...prev, 
                          discount: { 
                            ...prev.discount!, 
                            value: parseFloat(e.target.value) || 0 
                          } 
                        } : null
                      )}
                      className={discountingProduct.discount?.type === 'fixed' ? 'pl-10' : 'pr-10'}
                      placeholder={discountingProduct.discount?.type === 'percentage' ? '10' : '5.00'}
                    />
                  </div>
                </div>
              </div>

              {discountingProduct.discount && (
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-success">
                    Final Price: ${calculateDiscountedPrice(discountingProduct).toFixed(2)}
                    {discountingProduct.discount.type === 'percentage' && (
                      <span className="ml-2">
                        ({discountingProduct.discount.value}% off)
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="discountActive"
                  checked={discountingProduct.discount?.active ?? true}
                  onChange={(e: any) => setDiscountingProduct(prev => 
                    prev ? { 
                      ...prev, 
                      discount: { 
                        ...prev.discount!, 
                        active: e.target.checked 
                      } 
                    } : null
                  )}
                  className="w-4 h-4"
                />
                <Label htmlFor="discountActive">Active discount</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdateDiscount}
                  disabled={!discountingProduct.discount?.value || discountingProduct.discount.value <= 0}
                  className="flex-1 bg-success hover:bg-success/90"
                >
                  {discountingProduct.discount && Object.keys(discountingProduct).includes('discount') ? 'Update Discount' : 'Add Discount'}
                </Button>
                
                {discountingProduct.discount && (
                  <Button
                    onClick={() => {
                      handleRemoveDiscount(discountingProduct);
                      setIsDiscountDialogOpen(false);
                    }}
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
                
                <Button
                  onClick={() => setIsDiscountDialogOpen(false)}
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