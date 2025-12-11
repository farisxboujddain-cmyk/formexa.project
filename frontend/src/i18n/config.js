import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { en, ar, fr },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false
    }
  });

// Set document direction for RTL
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('language', lng);
});

export default i18n;
