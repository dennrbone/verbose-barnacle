import { Plus, Edit2, Trash2, Egg, Milk, Apple, ChefHat, Carrot } from 'lucide-react';
import { useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  icon: string;
}

interface InventoryListProps {
  onNavigateToRecipes: () => void;
}

const iconMap: Record<string, any> = {
  egg: Egg,
  milk: Milk,
  apple: Apple,
  chef: ChefHat,
  carrot: Carrot,
};

export function InventoryList({ onNavigateToRecipes }: InventoryListProps) {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Eggs', quantity: '6', icon: 'egg' },
    { id: '2', name: 'Milk', quantity: '1L', icon: 'milk' },
    { id: '3', name: 'Tomatoes', quantity: '5', icon: 'apple' },
    { id: '4', name: 'Cheese', quantity: '200g', icon: 'chef' },
    { id: '5', name: 'Lettuce', quantity: '1', icon: 'carrot' },
  ]);

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-border sticky top-0 z-10">
        <h1 className="text-2xl mb-1">Inventory</h1>
        <p className="text-sm text-muted-foreground">{items.length} items in stock</p>
      </div>

      {/* Items List */}
      <div className="flex-1 px-6 py-6 space-y-3">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || Apple;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-0.5">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary active:scale-95 transition-transform">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive active:scale-95 transition-transform"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate Recipes Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onNavigateToRecipes}
          className="w-full bg-primary text-primary-foreground rounded-2xl p-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <ChefHat className="w-6 h-6" />
          <span>Generate Recipes</span>
        </button>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform z-20">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
