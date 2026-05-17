import { ChefHat, ShoppingBasket } from 'lucide-react';

interface DashboardProps {
  onNavigateToRecipes: () => void;
}

export function Dashboard({ onNavigateToRecipes }: DashboardProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-primary mx-auto flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Kitchen AI</h1>
          <p className="text-muted-foreground">
            Найдите рецепты по продуктам из вашего холодильника
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onNavigateToRecipes}
            className="w-full bg-primary text-white rounded-3xl p-6 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <ShoppingBasket className="w-12 h-12" />
            <span className="text-lg font-medium">Ввести продукты вручную или определить по фото</span>
          </button>
        </div>
      </div>
    </div>
  );
}