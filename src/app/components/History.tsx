import { Camera, ChefHat, Calendar } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'scan' | 'recipe';
  title: string;
  timestamp: string;
  itemCount?: number;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'recipe',
    title: 'Generated 4 recipes',
    timestamp: '2026-03-31 14:30',
  },
  {
    id: '2',
    type: 'scan',
    title: 'Fridge scan',
    timestamp: '2026-03-31 14:25',
    itemCount: 5,
  },
  {
    id: '3',
    type: 'recipe',
    title: 'Generated 6 recipes',
    timestamp: '2026-03-30 18:15',
  },
  {
    id: '4',
    type: 'scan',
    title: 'Fridge scan',
    timestamp: '2026-03-30 18:10',
    itemCount: 8,
  },
  {
    id: '5',
    type: 'recipe',
    title: 'Generated 3 recipes',
    timestamp: '2026-03-29 12:20',
  },
  {
    id: '6',
    type: 'scan',
    title: 'Fridge scan',
    timestamp: '2026-03-29 12:15',
    itemCount: 6,
  },
];

export function History() {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date('2026-03-31');
    const yesterday = new Date('2026-03-30');

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-border sticky top-0 z-10">
        <h1 className="text-2xl mb-1">History</h1>
        <p className="text-sm text-muted-foreground">Your activity timeline</p>
      </div>

      {/* Timeline */}
      <div className="flex-1 px-6 py-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-border" />

          {/* History Items */}
          <div className="space-y-6">
            {mockHistory.map((item, index) => (
              <div key={item.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center ${
                  item.type === 'scan' ? 'bg-primary' : 'bg-accent'
                }`}>
                  {item.type === 'scan' ? (
                    <Camera className="w-6 h-6 text-white" />
                  ) : (
                    <ChefHat className="w-6 h-6 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                  <h3 className="mb-1">{item.title}</h3>
                  {item.itemCount && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.itemCount} items detected
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
