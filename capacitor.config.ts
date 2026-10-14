import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.demo.bhdapp',
  appName: 'Demo BHD',
  webDir: 'www',
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      style: 'LIGHT',
    },
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#FFFFFF',
    },
  },
};

export default config;
