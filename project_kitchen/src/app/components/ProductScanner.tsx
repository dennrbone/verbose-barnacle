import { Camera, X, Upload, Zap, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Camera as CapacitorCamera, CameraSource, CameraResultType } from '@capacitor/camera';

interface DetectedProduct {
  id: string;
  name: string;
  confidence?: number;
  image?: string;
}

interface ProductScannerProps {
  onBack: () => void;
  onProductsDetected: (products: DetectedProduct[]) => void;
  onNavigateToRecipes: () => void;
}

export function ProductScanner({ onBack, onProductsDetected, onNavigateToRecipes }: ProductScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedProducts, setDetectedProducts] = useState<DetectedProduct[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [cameraImage, setCameraImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = async () => {
    try {
      setIsScanning(true);
      
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image && image.dataUrl) {
        setCameraImage(image.dataUrl);
        console.log('Photo captured successfully');

        // Simulate AI detection
        setTimeout(() => {
          const products: DetectedProduct[] = [
            { id: `camera-${Date.now()}-1`, name: 'Яйца', confidence: 0.95 },
            { id: `camera-${Date.now()}-2`, name: 'Молоко', confidence: 0.88 },
            { id: `camera-${Date.now()}-3`, name: 'Помидоры', confidence: 0.92 },
            { id: `camera-${Date.now()}-4`, name: 'Сыр', confidence: 0.85 },
            { id: `camera-${Date.now()}-5`, name: 'Салат', confidence: 0.79 }
          ];
          setDetectedProducts(prev => [...prev, ...products]);
          setIsScanning(false);
          console.log('Products detected:', products);
        }, 2000);
      } else {
        setIsScanning(false);
        alert('Фото не было сделано');
      }
    } catch (error) {
      console.error('Camera error:', error);
      setIsScanning(false);
      alert('Ошибка при доступе к камере. Проверьте разрешения.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setUploadedImages(prev => [...prev, ...newImages]);
              // Simulate AI detection for uploaded images
              setTimeout(() => {
                const products: DetectedProduct[] = [
                  { id: '6', name: 'Хлеб', confidence: 0.91 },
                  { id: '7', name: 'Масло', confidence: 0.87 },
                  { id: '8', name: 'Лук', confidence: 0.84 }
                ];
                setDetectedProducts(prev => [...prev, ...products]);
              }, 1500);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  
  const handleRemoveProduct = (productId: string) => {
    setDetectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddCustomProduct = () => {
    const productName = prompt('Введите название продукта:');
    if (productName && productName.trim()) {
      const newProduct: DetectedProduct = {
        id: `custom-${Date.now()}`,
        name: productName.trim(),
        confidence: 1.0
      };
      setDetectedProducts(prev => [...prev, newProduct]);
    }
  };

  const handleGenerateRecipes = () => {
    if (detectedProducts.length > 0) {
      onProductsDetected(detectedProducts);
      onNavigateToRecipes();
    } else {
      alert('Добавьте продукты для генерации рецептов');
    }
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
          <p className="text-white text-sm">Сканирование продуктов</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="absolute top-20 left-0 right-0 z-10 px-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              activeTab === 'camera' ? 'bg-primary text-white' : 'text-white/70'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm">Камера</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              activeTab === 'upload' ? 'bg-primary text-white' : 'text-white/70'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Загрузить</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden mt-32">
        {activeTab === 'camera' && (
          <div className="h-full">
            {/* Camera Viewfinder */}
            <div className="h-full relative">
              <video
                ref={(videoEl) => {
                  if (videoEl && !cameraImage) {
                    // Start camera stream with better focus settings
                    navigator.mediaDevices.getUserMedia({ 
                      video: { 
                        facingMode: 'environment',
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                      } 
                    })
                    .then(stream => {
                      videoEl.srcObject = stream;
                      videoEl.play();
                      
                      // Try to optimize camera settings
                      const track = stream.getVideoTracks()[0];
                      if (track && 'applyConstraints' in track) {
                        track.applyConstraints({
                          advanced: [
                            { width: { ideal: 1920 } },
                            { height: { ideal: 1080 } },
                            { aspectRatio: 16/9 }
                          ]
                        }).catch(err => console.log('Camera constraints not supported:', err));
                      }
                    })
                    .catch(err => {
                      console.error('Camera access error:', err);
                    });
                  }
                }}
                className="w-full h-full object-cover"
                style={{ display: cameraImage ? 'none' : 'block' }}
                autoPlay
                playsInline
              />
              
              {cameraImage && (
                // Show captured image
                <div className="absolute inset-0">
                  <img 
                    src={cameraImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="bg-primary/20 backdrop-blur-sm rounded-3xl p-6 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-primary animate-pulse" />
                        <p className="text-white">Сканирование...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Center focus frame */}
              {!cameraImage && (
                <div className="absolute inset-0 flex items-start justify-center pt-12 pointer-events-none">
                  <div className="w-80 h-80 border-4 border-white/30 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls - Moved higher */}
            <div className="absolute bottom-48 left-0 right-0 flex flex-col items-center gap-4 px-8">
              <p className="text-white/70 text-sm text-center">
                Наведите на продукты и нажмите для съемки
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // Capture from video stream
                    const video = document.querySelector('video');
                    if (video) {
                      const canvas = document.createElement('canvas');
                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                      const ctx = canvas.getContext('2d');
                      ctx?.drawImage(video, 0, 0);
                      setCameraImage(canvas.toDataURL('image/jpeg', 0.9));
                      
                      // Simulate AI detection
                      setTimeout(() => {
                        const products: DetectedProduct[] = [
                          { id: `camera-${Date.now()}-1`, name: 'Яйца', confidence: 0.95 },
                          { id: `camera-${Date.now()}-2`, name: 'Молоко', confidence: 0.88 },
                          { id: `camera-${Date.now()}-3`, name: 'Помидоры', confidence: 0.92 },
                          { id: `camera-${Date.now()}-4`, name: 'Сыр', confidence: 0.85 },
                          { id: `camera-${Date.now()}-5`, name: 'Салат', confidence: 0.79 }
                        ];
                        setDetectedProducts(prev => [...prev, ...products]);
                        setIsScanning(false);
                      }, 2000);
                      setIsScanning(true);
                    }
                  }}
                  disabled={isScanning}
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                >
                  <Camera className="w-10 h-10 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm">
              <div className="flex flex-col items-center gap-4">
                <ImageIcon className="w-16 h-16 text-white/50" />
                <h3 className="text-white text-lg">Загрузите фото продуктов</h3>
                <p className="text-white/70 text-sm text-center">
                  Вы можете загрузить несколько фото
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-primary text-white rounded-2xl p-4 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Выбрать фото</span>
                </button>

                {uploadedImages.length > 0 && (
                  <div className="w-full">
                    <p className="text-white/70 text-sm mb-2">
                      Загружено фото: {uploadedImages.length}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

              </div>

      
      {/* Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <button
          onClick={handleGenerateRecipes}
          disabled={detectedProducts.length === 0}
          className="w-full bg-primary text-white rounded-2xl p-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>Определить продукты</span>
        </button>
      </div>
    </div>
  );
}
