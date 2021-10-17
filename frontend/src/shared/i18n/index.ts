import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export default i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: {
          // Shared
          shared__continue_with_google: 'Continue with Google',
          // Student Sign In
          student_sign_in__header: 'Welcome to the Star Platform',
          // Student Home
          shared__home: 'Home',
        },
      },
    },
    fallbackLng: 'en-US',
  });
