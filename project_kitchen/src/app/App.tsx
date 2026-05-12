import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProductScanner } from './components/ProductScanner';
import { RecipeGenerator } from './components/RecipeGenerator';
import { BottomNav } from './components/BottomNav';

type Screen = 'dashboard' | 'scanner' | 'recipes';

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

  const handleProductsDetected = (products: DetectedProduct[]) => {
    setDetectedProducts(products);
  };

  const renderContent = () => {
    switch (screen) {
      case 'scanner':
        return (
          <ProductScanner
            onBack={() => setScreen('dashboard')}
            onProductsDetected={handleProductsDetected}
            onNavigateToRecipes={() => setScreen('recipes')}
          />
        );
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
        return (
          <Dashboard
            onNavigateToScanner={() => {
              setDetectedProducts([]);
              setScreen('scanner');
            }}
            onNavigateToRecipes={() => {
              setDetectedProducts([]);
              setScreen('recipes');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-white">
      {renderContent()}
      {screen !== 'scanner' && (
        <BottomNav
          activeTab="home"
          onTabChange={() => setScreen('dashboard')}
        />
      )}
    </div>
  );
}