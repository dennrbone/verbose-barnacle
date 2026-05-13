import { Camera, X, Zap } from 'lucide-react';
import { useState } from 'react';

interface CameraInterfaceProps {
  onBack: () => void;
  onCapture: (items: string[]) => void;
}

export function CameraInterface({ onBack, onCapture }: CameraInterfaceProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);

  const handleCapture = () => {
    setIsScanning(true);

    // Simulate AI detection
    setTimeout(() => {
      const items = ['Eggs', 'Milk', 'Tomatoes', 'Cheese', 'Lettuce'];
      setDetectedItems(items);
      setIsScanning(false);

      setTimeout(() => {
        onCapture(items);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
          <p className="text-white text-sm">AI Detection Active</p>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        {/* Simulated camera feed */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
          {/* Grid overlay */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/10" />
            ))}
          </div>

          {/* Detection boxes */}
          {detectedItems.length > 0 && (
            <div className="absolute inset-0 p-8">
              {detectedItems.map((item, index) => (
                <div
                  key={item}
                  className="absolute border-2 border-primary rounded-lg animate-pulse"
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${10 + (index % 2) * 40}%`,
                    width: '35%',
                    height: '12%',
                  }}
                >
                  <div className="bg-primary text-white px-2 py-1 text-xs rounded-md absolute -top-6 left-0">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scanning indicator */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/20 backdrop-blur-sm rounded-3xl p-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <p className="text-white">Scanning...</p>
              </div>
            </div>
          )}
        </div>

        {/* Center focus frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-80 border-4 border-white/30 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-4">
        <p className="text-white/70 text-sm text-center">
          Point camera at your fridge contents
        </p>
        <button
          onClick={handleCapture}
          disabled={isScanning}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
        >
          <Camera className="w-10 h-10 text-white" />
        </button>
      </div>
    </div>
  );
}
