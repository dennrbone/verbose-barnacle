import { Camera, Package, ChefHat, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onNavigateToCamera: () => void;
  onNavigateToInventory: () => void;
  inventoryCount: number;
}

export function Dashboard({ onNavigateToCamera, onNavigateToInventory, inventoryCount }: DashboardProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">Kitchen AI</h1>
            <p className="text-sm text-muted-foreground">Smart food management</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        {/* Scan Button */}
        <button
          onClick={onNavigateToCamera}
          className="w-full bg-primary text-primary-foreground rounded-3xl p-8 mb-6 shadow-lg active:scale-95 transition-transform"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <Camera className="w-10 h-10" />
            </div>
            <h2 className="text-2xl">Scan Fridge</h2>
            <p className="text-sm text-primary-foreground/80">
              Take a photo to detect items
            </p>
          </div>
        </button>

        {/* Inventory Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Current Inventory</h3>
            <button
              onClick={onNavigateToInventory}
              className="text-primary text-sm"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-2xl p-4">
              <Package className="w-8 h-8 text-primary mb-2" />
              <p className="text-3xl mb-1">{inventoryCount}</p>
              <p className="text-sm text-muted-foreground">Items</p>
            </div>
            <div className="bg-secondary rounded-2xl p-4">
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <p className="text-3xl mb-1">87%</p>
              <p className="text-sm text-muted-foreground">Fresh</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-secondary text-secondary-foreground rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform">
              <ChefHat className="w-6 h-6 text-primary" />
              <span>Generate Recipes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
