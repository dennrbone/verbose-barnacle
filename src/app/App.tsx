import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { CameraInterface } from './components/CameraInterface';
import { InventoryList } from './components/InventoryList';
import { RecipeGeneration } from './components/RecipeGeneration';
import { RecipeResults } from './components/RecipeResults';
import { History } from './components/History';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';

type Screen = 'dashboard' | 'camera' | 'inventory' | 'recipeGen' | 'recipeResults';
type TabScreen = 'home' | 'history' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabScreen>('home');
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [inventoryCount, setInventoryCount] = useState(5);

  const handleScanCapture = (items: string[]) => {
    setInventoryCount(items.length);
    setScreen('inventory');
  };

  const renderContent = () => {
    if (activeTab === 'history') {
      return <History />;
    }
    if (activeTab === 'profile') {
      return <Profile />;
    }

    // Home tab screens
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
            onNavigateToInventory={() => setScreen('inventory')}
            inventoryCount={inventoryCount}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-white">
      {renderContent()}
      {screen !== 'camera' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'home') {
              setScreen('dashboard');
            }
          }}
        />
      )}
    </div>
  );
}