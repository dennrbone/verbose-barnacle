import { ChefHat, Clock, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface RecipeGenerationProps {
  onGenerateRecipes: (scheduledTime?: string) => void;
}

export function RecipeGeneration({ onGenerateRecipes }: RecipeGenerationProps) {
  const [selectedTime, setSelectedTime] = useState('now');

  const timeOptions = [
    { id: 'now', label: 'Now', value: 'now' },
    { id: 'lunch', label: 'Lunch Time', value: '12:00' },
    { id: 'dinner', label: 'Dinner Time', value: '18:00' },
    { id: 'custom', label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">Recipe Generator</h1>
            <p className="text-sm text-muted-foreground">AI-powered suggestions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 space-y-6">
        {/* Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="mb-1">Smart Recipe Matching</h3>
              <p className="text-sm text-muted-foreground">
                Our AI will analyze your inventory and suggest delicious recipes you can make right now.
              </p>
            </div>
          </div>
        </div>

        {/* Time Picker */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3>When to send recipes</h3>
          </div>

          <div className="space-y-2">
            {timeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedTime(option.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  selectedTime === option.id
                    ? 'border-primary bg-secondary'
                    : 'border-border bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {selectedTime === option.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedTime === 'custom' && (
            <div className="mt-4">
              <input
                type="time"
                className="w-full p-4 rounded-2xl border-2 border-border bg-white"
                defaultValue="12:00"
              />
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="mb-4">Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-secondary cursor-pointer">
              <span className="text-sm">Quick meals (under 30 min)</span>
              <input type="checkbox" className="w-5 h-5 rounded accent-primary" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-secondary cursor-pointer">
              <span className="text-sm">Vegetarian options</span>
              <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-secondary cursor-pointer">
              <span className="text-sm">Use all ingredients</span>
              <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
            </label>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onGenerateRecipes(selectedTime)}
          className="w-full bg-primary text-primary-foreground rounded-2xl p-5 flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-lg">Generate Recipes</span>
        </button>
      </div>
    </div>
  );
}
