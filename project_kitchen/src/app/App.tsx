import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { RecipeGenerator } from './components/RecipeGenerator';
import { BottomNav } from './components/BottomNav';

type Screen = 'dashboard' | 'recipes';

interface DetectedProduct {
  id: string;
  name: string;
  confidence?: number;
  image?: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [detectedProducts, setDetectedProducts] = useState<DetectedProduct[]>([]);
  const [textIngredients, setTextIngredients] = useState<string>('');

  const renderContent = () => {
    switch (screen) {
      case 'recipes':
        return (
          <RecipeGenerator
            onBack={() => setScreen('dashboard')}
            detectedProducts={detectedProducts}
            textIngredients={textIngredients}
            onTextIngredientsChange={setTextIngredients}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            onNavigateToRecipes={() => {
              setDetectedProducts([]);
              setScreen('recipes');
            }}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-white">
      {renderContent()}
      {}
      <BottomNav
        activeTab="home"
        onTabChange={() => setScreen('dashboard')}
      />
    </div>
  );
}