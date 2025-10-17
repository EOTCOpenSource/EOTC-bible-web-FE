
const locales = ['en', 'am', 'geez', 'tigrigna', 'oromigna'] as const;
import messages from '@/messages/en.json';
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
  }
}