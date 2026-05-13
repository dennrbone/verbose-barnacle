import { User, Bell, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export function Profile() {
  const menuItems = [
    { icon: Bell, label: 'Notifications', badge: '3' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: LogOut, label: 'Logout', danger: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl mb-1">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1">Kitchen Chef</h2>
              <p className="text-sm text-muted-foreground">chef@kitchen.ai</p>
            </div>
          </div>
          <button className="w-full bg-secondary text-secondary-foreground rounded-xl py-3 active:scale-95 transition-transform">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform ${
              item.danger ? 'text-destructive' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              item.danger ? 'bg-destructive/10' : 'bg-secondary'
            }`}>
              <item.icon className={`w-6 h-6 ${item.danger ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                {item.badge}
              </div>
            )}
            {!item.danger && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
          </button>
        ))}
      </div>

      {/* App Info */}
      <div className="px-6 mt-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>Kitchen AI v1.0.0</p>
          <p className="mt-1">Made with AI</p>
        </div>
      </div>
    </div>
  );
}
