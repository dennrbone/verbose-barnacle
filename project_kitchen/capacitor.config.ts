import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.ai_kitchen_assistant',
  appName: 'AI Kitchen Assistant',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
  },
}

export default config
