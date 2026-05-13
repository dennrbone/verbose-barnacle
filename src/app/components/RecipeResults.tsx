import { Clock, ChefHat, Bookmark, Share2 } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  matchPercentage: number;
  image: string;
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Fluffy Scrambled Eggs',
    cookingTime: '10 min',
    matchPercentage: 95,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Caesar Salad',
    cookingTime: '15 min',
    matchPercentage: 88,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Cheese Omelette',
    cookingTime: '12 min',
    matchPercentage: 92,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Caprese Salad',
    cookingTime: '8 min',
    matchPercentage: 85,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop',
  },
];

export function RecipeResults() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-border sticky top-0 z-10">
        <h1 className="text-2xl mb-1">Recipe Suggestions</h1>
        <p className="text-sm text-muted-foreground">Based on your current inventory</p>
      </div>

      {/* Recipe Cards */}
      <div className="flex-1 px-6 py-6 space-y-4">
        {mockRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-3xl shadow-sm overflow-hidden active:scale-98 transition-transform"
          >
            {/* Recipe Image */}
            <div className="relative h-48 bg-secondary">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-full text-sm">
                {recipe.matchPercentage}% Match
              </div>
            </div>

            {/* Recipe Info */}
            <div className="p-5">
              <h3 className="mb-2">{recipe.title}</h3>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookingTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4" />
                  <span>Easy</span>
                </div>
              </div>

              {/* Match Indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Ingredient Match</span>
                  <span>{recipe.matchPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${recipe.matchPercentage}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-white rounded-xl py-3 active:scale-95 transition-transform">
                  View Recipe
                </button>
                <button className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary active:scale-95 transition-transform">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary active:scale-95 transition-transform">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
