import { ArrowLeft, ChefHat, Clock, Users, Sparkles, Image as ImageIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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

// GigaChat API service placeholder
class GigaChatService {
  private static instance: GigaChatService;
  private baseUrl: string = 'https://gigachat-api.example.com/v1';

  static getInstance(): GigaChatService {
    if (!GigaChatService.instance) {
      GigaChatService.instance = new GigaChatService();
    }
    return GigaChatService.instance;
  }

  async recognizeIngredients(imageData: string[]): Promise<DetectedProduct[]> {
    // Placeholder for GigaChat image recognition
    // This will be implemented when API is connected
    console.log('GigaChat: Recognizing ingredients from images...');
    return [];
  }

  async generateRecipes(ingredients: string[]): Promise<Recipe[]> {
    // Placeholder for GigaChat recipe generation
    // This will be implemented when API is connected
    console.log('GigaChat: Generating recipes from ingredients...', ingredients);
    
    // Simulate API response
    return [
      {
        id: '1',
        title: 'Омлет с овощами',
        description: 'Простой и вкусный омлет с помидорами и сыром',
        cookTime: '15 мин',
        servings: 2,
        ingredients: ['Яйца (3 шт)', 'Помидоры (2 шт)', 'Сыр (100г)', 'Молоко (50мл)', 'Соль, перец'],
        instructions: [
          'Нарежьте помидоры и сыр',
          'Взбейте яйца с молоком, солью и перцем',
          'Разогрейте сковороду с маслом',
          'Вылейте яичную смесь и жарьте 2-3 минуты',
          'Добавьте помидоры и сыр, сложите омлет пополам'
        ],
        confidence: 0.92
      },
      {
        id: '2',
        title: 'Салат с помидорами и сыром',
        description: 'Свежий салат с овощами и сыром',
        cookTime: '10 мин',
        servings: 2,
        ingredients: ['Помидоры (3 шт)', 'Сыр (150г)', 'Салатные листья', 'Оливковое масло', 'Соль'],
        instructions: [
          'Нарежьте помидоры дольками',
          'Нарежьте сыр кубиками',
          'Порвите листья салата',
          'Смешайте все ингредиенты',
          'Заправьте оливковым маслом и солью'
        ],
        confidence: 0.88
      }
    ];
  }

  async generateRecipeImage(recipeTitle: string): Promise<string> {
    // Placeholder for GigaChat image generation
    // This will be implemented when API is connected
    console.log('GigaChat: Generating image for recipe:', recipeTitle);
    return `https://picsum.photos/seed/${recipeTitle}/400/300.jpg`;
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

  const gigachatService = GigaChatService.getInstance();

  const handleGenerateRecipes = async () => {
    setIsGenerating(true);
    
    try {
      // Clear old recipes first
      setRecipes([]);

      // Combine detected products and text ingredients
      const allIngredients = [
        ...detectedProducts.map(p => p.name),
        ...textIngredients.split(',').map(i => i.trim()).filter(i => i)
      ];

      if (allIngredients.length === 0) {
        alert('Добавьте продукты для генерации рецептов');
        return;
      }

      const generatedRecipes = await gigachatService.generateRecipes(allIngredients);
      
      // Generate images for recipes
      const recipesWithImages = await Promise.all(
        generatedRecipes.map(async (recipe) => ({
          ...recipe,
          image: await gigachatService.generateRecipeImage(recipe.title)
        }))
      );

      setRecipes(recipesWithImages);
    } catch (error) {
      console.error('Recipe generation error:', error);
      alert('Ошибка при генерации рецептов');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  if (selectedRecipe) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToRecipes}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl">{selectedRecipe.title}</h1>
              <p className="text-sm text-muted-foreground">{selectedRecipe.description}</p>
            </div>
          </div>
        </div>

        {/* Recipe Image */}
        {selectedRecipe.image && (
          <div className="px-6 mb-6">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200">
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Recipe Info */}
        <div className="px-6 mb-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{selectedRecipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{selectedRecipe.servings} порции</span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Ингредиенты</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <ul className="space-y-2">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Инструкции</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <ol className="space-y-3">
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl">Генератор рецептов</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 space-y-6">
        {/* Products */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3>Продукты ({detectedProducts.length})</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const productName = prompt('Введите название продукта:');
                  if (productName && productName.trim()) {
                    const newProduct: DetectedProduct = {
                      id: `custom-${Date.now()}`,
                      name: productName.trim(),
                      confidence: 1.0
                    };
                    setDetectedProducts(prev => [...prev, newProduct]);
                  }
                }}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                title="Добавить продукт"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          {detectedProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Нет продуктов. Нажмите + чтобы добавить.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {detectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-secondary rounded-xl p-3"
                >
                  <span className="text-sm">{product.name}</span>
                  <button
                    onClick={() => {
                      setDetectedProducts(prev => prev.filter(p => p.id !== product.id));
                    }}
                    className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                    title="Удалить продукт"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Recipes Button */}
        <button
          onClick={handleGenerateRecipes}
          disabled={isGenerating || detectedProducts.length === 0}
          className="w-full bg-primary text-white rounded-3xl p-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Генерация...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Сгенерировать рецепты</span>
            </>
          )}
        </button>

        {/* Generated Recipes */}
        {recipes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Сгенерированные рецепты</h3>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe)}
                className="bg-white rounded-3xl p-6 shadow-sm cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex gap-4">
                  {recipe.image && (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{recipe.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{recipe.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{recipe.servings} порции</span>
                      </div>
                      {recipe.confidence && (
                        <span>Точность: {Math.round(recipe.confidence * 100)}%</span>
                      )}
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
