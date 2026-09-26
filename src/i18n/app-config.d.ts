import type { Locale } from './config';
import type messages from './messages/en-GB.json';

// Makes translation keys type-checked: t('home.statment') is a compile error.
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
