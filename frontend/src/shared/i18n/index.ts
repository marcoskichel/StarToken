import i18n, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export default i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: {
          student_sign_in__header: 'Welcome to the Star Platform',
        },
      },
    },
    fallbackLng: 'en-US',
    debug: true,
  });
