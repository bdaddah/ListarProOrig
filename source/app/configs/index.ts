import {version} from '../../package.json';
import moment from 'moment';
import {themeSupport} from './theme';

/**
 * Basic Setting Variables Define
 */
export const Settings = {
  name: 'Listar Pro',
  appVersion: version,
  // NEW BACKEND: TypeScript/Node.js backend (replaces WordPress)
  // Use your local IP address so mobile devices/emulators can connect
  domain: 'http://192.168.1.18:3000',
  // OLD WORDPRESS: Uncomment to use WordPress backend
  // domain: 'https://ichhar.kinsta.cloud',
  defaultLanguage: 'en',
  defaultFont: 'Poppins',
  fontSupport: ['SFProText', 'Raleway', 'Poppins'],
  defaultTheme: themeSupport[0],
  themeSupport: themeSupport,
  languageSupport: [
    'en',
    'vi',
    'ar',
    'da',
    'de',
    'el',
    'fr',
    'he',
    'id',
    'ja',
    'ko',
    'lo',
    'nl',
    'zh',
    'fa',
    'km',
  ],
  storeReview: moment().isBefore(moment('2023-01-01', 'YYYY-MM-DD')),
};
