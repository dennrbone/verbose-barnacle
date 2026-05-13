import { Camera, ChefHat } from 'lucide-react';

interface DashboardProps {
  onNavigateToCamera: () => void;
}

export function Dashboard({ onNavigateToCamera }: DashboardProps) {
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
          className="w-full bg-primary text-primary-foreground rounded-3xl p-8 shadow-lg active:scale-95 transition-transform"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <Camera className="w-10 h-10" />
            </div>
            <h2 className="text-2xl">Scan Products</h2>
            <p className="text-sm text-primary-foreground/80">
              Take a photo to detect items
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
