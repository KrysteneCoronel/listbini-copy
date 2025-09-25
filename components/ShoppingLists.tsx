import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, List, Trash2, Edit, Check, Star, Heart } from 'lucide-react';
import { CartItem } from '../App';

interface ShoppingListItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: Date;
}

const MOCK_LISTS: ShoppingList[] = [
  {
    id: '1',
    name: 'Weekly Groceries',
    items: [
      { id: '1', name: 'Milk', completed: false },
      { id: '2', name: 'Bread', completed: true },
      { id: '3', name: 'Eggs', completed: false },
      { id: '4', name: 'Apples', completed: false },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Party Supplies',
    items: [
      { id: '5', name: 'Chips', completed: false },
      { id: '6', name: 'Soda', completed: false },
      { id: '7', name: 'Ice cream', completed: true },
    ],
    createdAt: new Date('2024-01-20'),
  },
];

interface Props {
  favorites: CartItem[];
}

export function ShoppingLists({ favorites }: Props) {
  const [lists, setLists] = useState<ShoppingList[]>(MOCK_LISTS);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [editingList, setEditingList] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const createList = () => {
    if (newListName.trim()) {
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        items: [],
        createdAt: new Date(),
      };
      setLists(prev => [newList, ...prev]);
      setNewListName('');
      setIsCreateDialogOpen(false);
    }
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const addItemToList = (listId: string) => {
    if (newItemName.trim()) {
      const newItem: ShoppingListItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        completed: false,
      };
      
      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? { ...list, items: [...list.items, newItem] }
            : list
        )
      );
      setNewItemName('');
    }
  };

  const toggleItemCompletion = (listId: string, itemId: string) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            }
          : list
      )
    );
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
      )
    );
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-background">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Lists</h1>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Shopping List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter list name..."
                  value={newListName}
                  onChange={(e: any) => setNewListName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createList()}
                />
                <div className="flex gap-2">
                  <Button onClick={createList} className="flex-1">
                    Create List
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4">
        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-6">
            <div className="bg-card mx-4 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-warning fill-current" />
                <h2 className="font-medium">Favorite Items</h2>
                <span className="text-sm text-muted-foreground">
                  ({favorites.length})
                </span>
              </div>
              
              <div className="space-y-2">
                {favorites.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} • {item.barcode}
                      </p>
                    </div>
                    <Star className="w-4 h-4 text-warning fill-current" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {lists.length === 0 && favorites.length === 0 ? (
          <div className="bg-card mx-4 p-12 text-center rounded-xl shadow-sm">
            <List className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="font-medium text-foreground">No shopping lists yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first list to get started</p>
          </div>
        ) : lists.length === 0 ? (
          <div className="bg-card mx-4 p-8 text-center rounded-xl shadow-sm">
            <List className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="font-medium text-foreground">No custom lists yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create a list to organize your shopping</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lists.map((list) => (
              <div key={list.id} className="bg-card mx-4 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-medium">{list.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {list.items.filter(item => item.completed).length} of{' '}
                      {list.items.length} completed
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingList(editingList === list.id ? null : list.id)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteList(list.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {editingList === list.id && (
                  <div className="mb-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new item..."
                        value={newItemName}
                        onChange={(e: any) => setNewItemName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && addItemToList(list.id)
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => addItemToList(list.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/50"
                    >
                      <button
                        onClick={() => toggleItemCompletion(list.id, item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.completed
                            ? 'bg-accent border-accent text-accent-foreground'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3" />}
                      </button>
                      
                      <span
                        className={`flex-1 ${
                          item.completed
                            ? 'line-through text-muted-foreground'
                            : ''
                        }`}
                      >
                        {item.name}
                      </span>
                      
                      {editingList === list.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromList(list.id, item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}