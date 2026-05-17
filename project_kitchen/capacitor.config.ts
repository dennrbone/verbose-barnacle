import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.ai_kitchen_assistant',
  appName: 'AI Kitchen Assistant',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    
  
    allowNavigation: [
      'nhtdlf-188-232-145-9.ru.tuna.am',
      '*.tuna.am',  
    ],
  },
  plugins: {

    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config