import { ArrowLeft, ChefHat, Clock, Users, Sparkles, Image as ImageIcon, Loader2, Plus, Trash2, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DetectedProduct {
  id: string;
  name: string;
  confidence?: number;
  image?: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  image?: string;
  confidence?: number;
}

interface RecipeGeneratorProps {
  onBack: () => void;
  detectedProducts: DetectedProduct[];
  textIngredients: string;
  onTextIngredientsChange: (value: string) => void;
}

// ============================================
// 🔧 КОНФИГУРАЦИЯ - ИЗМЕНИТЕ IP ВАШЕГО ПК
// ============================================
const API_CONFIG = {
  PC_IP: '192.168.0.110',  // <----- ВАШ IP
  PORT: 8000,
  
  get baseUrl() {
    return `http://${this.PC_IP}:${this.PORT}`;
  },
  
  get recipeEndpoint() {
    return `${this.baseUrl}/api/recipe`;
  }
};

// ============================================
// 🍽️ API СЕРВИС - РЕАЛЬНЫЕ ЗАПРОСЫ К ВАШЕМУ FASTAPI
// ============================================
class RecipeApiService {
  static async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_CONFIG.baseUrl}/docs`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Server connection failed:', error);
      return false;
    }
  }

  static async getRecipesByText(ingredients: string): Promise<Recipe[]> {
    const formData = new FormData();
    formData.append('text_ingredients', ingredients);

    const response = await fetch(API_CONFIG.recipeEndpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    console.log('API Response:', data);

    return data.recipes.map((recipe: any, index: number) => ({
      id: `recipe-${index}`,
      title: recipe.title,
      description: `🍽 ${recipe.ingredients?.length || 0} ингредиентов, ${recipe.steps?.length || 0} шагов`,
      cookTime: recipe.time || 'Время не указано',
      servings: 2,
      ingredients: recipe.ingredients || [],
      instructions: recipe.steps || [],
      confidence: 0.9,
    }));
  }

  static async getRecipesByImage(imageFile: File, textIngredients?: string): Promise<Recipe[]> {
    const formData = new FormData();
    formData.append('image_file', imageFile);
    
    if (textIngredients && textIngredients.trim()) {
      formData.append('text_ingredients', textIngredients);
    }

    const response = await fetch(API_CONFIG.recipeEndpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    console.log('API Response (image):', data);

    return data.recipes.map((recipe: any, index: number) => ({
      id: `recipe-${index}`,
      title: recipe.title,
      description: `🍽 ${recipe.ingredients?.length || 0} ингредиентов, ${recipe.steps?.length || 0} шагов`,
      cookTime: recipe.time || 'Время не указано',
      servings: 2,
      ingredients: recipe.ingredients || [],
      instructions: recipe.steps || [],
      confidence: 0.9,
    }));
  }
}

export function RecipeGenerator({ 
  onBack, 
  detectedProducts: initialDetectedProducts, 
  textIngredients, 
  onTextIngredientsChange 
}: RecipeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [detectedProducts, setDetectedProducts] = useState<DetectedProduct[]>(initialDetectedProducts);
  const [serverAvailable, setServerAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const checkServer = async () => {
      const available = await RecipeApiService.checkConnection();
      setServerAvailable(available);
      if (!available) {
        setError(`❌ Сервер недоступен!\nIP: ${API_CONFIG.PC_IP}:${API_CONFIG.PORT}`);
      }
    };
    checkServer();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateRecipes = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const allIngredients = [
        ...detectedProducts.map(p => p.name),
        ...textIngredients.split(',').map(i => i.trim()).filter(i => i)
      ];

      const ingredientsText = allIngredients.join(', ');

      if (!ingredientsText && !selectedImage) {
        alert('Добавьте продукты или фото для генерации рецептов');
        setIsGenerating(false);
        return;
      }

      let generatedRecipes: Recipe[];

      if (selectedImage) {
        generatedRecipes = await RecipeApiService.getRecipesByImage(
          selectedImage,
          ingredientsText || undefined
        );
      } else {
        generatedRecipes = await RecipeApiService.getRecipesByText(ingredientsText);
      }

      setRecipes(generatedRecipes);
      
      if (generatedRecipes.length === 0) {
        setError('Не удалось сгенерировать рецепты.');
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при генерации рецептов');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const addCustomProduct = () => {
    const productName = prompt('Введите название продукта:');
    if (productName && productName.trim()) {
      const newProduct: DetectedProduct = {
        id: `custom-${Date.now()}`,
        name: productName.trim(),
      };
      setDetectedProducts(prev => [...prev, newProduct]);
    }
  };

  const removeProduct = (productId: string) => {
    setDetectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  if (selectedRecipe) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-6 pt-8 pb-4 border-b">
          <button onClick={() => setSelectedRecipe(null)} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">{selectedRecipe.title}</h1>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{selectedRecipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">{selectedRecipe.servings} порции</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">🥕 Ингредиенты</h2>
            <ul className="space-y-2">
              {selectedRecipe.ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">👨‍🍳 Приготовление</h2>
            <ol className="space-y-3">
              {selectedRecipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-6 pt-8 pb-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Генератор рецептов</h1>
          </div>
        </div>
        
        {serverAvailable === false && (
          <div className="mt-3 bg-red-100 text-red-700 text-sm p-3 rounded-xl">
            ⚠️ Сервер {API_CONFIG.PC_IP}:{API_CONFIG.PORT} недоступен
          </div>
        )}
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* 📸 Фото продуктов - ГАЛЕРЕЯ + КАМЕРА */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold mb-3">📸 Фото продуктов</h3>
          <div className="flex items-center gap-3">
            {/* Кнопка ГАЛЕРЕЯ */}
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-xl p-3 transition flex flex-col items-center gap-1">
              <ImageIcon className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-500">Галерея</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>

            {/* Кнопка КАМЕРА */}
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-xl p-3 transition flex flex-col items-center gap-1">
              <Camera className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-500">Камера</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>

            {imagePreview && (
              <div className="relative ml-2">
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                <button
                  onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">ℹ️ Gigachat поддерживает только одно фото</p>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">🥕 Продукты ({detectedProducts.length})</h3>
            <button onClick={addCustomProduct} className="text-green-600">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <textarea
            value={textIngredients}
            onChange={(e) => onTextIngredientsChange(e.target.value)}
            placeholder="Введите ингредиенты через запятую"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
            rows={2}
          />
          
          {detectedProducts.map((product) => (
            <div key={product.id} className="flex justify-between items-center bg-gray-50 rounded-xl p-2 mb-2">
              <span className="text-sm">{product.name}</span>
              <button onClick={() => removeProduct(product.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleGenerateRecipes}
          disabled={isGenerating || serverAvailable === false}
          className="w-full bg-green-600 text-white rounded-2xl p-4 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Генерация 3 рецептов...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Сгенерировать 3 рецепта
            </>
          )}
        </button>

        {recipes.length > 0 && (
          <div className="space-y-3 pb-4">
            <h3 className="font-semibold text-lg">🍽 Рецепты ({recipes.length})</h3>
            {recipes.map((recipe, idx) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe)}
                className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-98 transition-transform"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{recipe.title}</h4>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>⏱ {recipe.cookTime}</span>
                      <span>👥 {recipe.servings} порции</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}