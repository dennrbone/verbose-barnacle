import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { CameraInterface } from './components/CameraInterface';
import { InventoryList } from './components/InventoryList';
import { RecipeGeneration } from './components/RecipeGeneration';
import { RecipeResults } from './components/RecipeResults';
import { BottomNav } from './components/BottomNav';

type Screen = 'dashboard' | 'camera' | 'inventory' | 'recipeGen' | 'recipeResults';

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');

  const handleScanCapture = (items: string[]) => {
    setScreen('inventory');
  };

  const renderContent = () => {
    switch (screen) {
      case 'camera':
        return (
          <CameraInterface
            onBack={() => setScreen('dashboard')}
            onCapture={handleScanCapture}
          />
        );
      case 'inventory':
        return (
          <InventoryList
            onNavigateToRecipes={() => setScreen('recipeGen')}
          />
        );
      case 'recipeGen':
        return (
          <RecipeGeneration
            onGenerateRecipes={() => setScreen('recipeResults')}
          />
        );
      case 'recipeResults':
        return <RecipeResults />;
      default:
        return (
          <Dashboard
            onNavigateToCamera={() => setScreen('camera')}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-white">
      {renderContent()}
      {screen !== 'camera' && (
        <BottomNav
          activeTab="home"
          onTabChange={() => setScreen('dashboard')}
        />
      )}
    </div>
  );
}