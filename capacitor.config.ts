import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qr.app',
  appName: 'my-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
