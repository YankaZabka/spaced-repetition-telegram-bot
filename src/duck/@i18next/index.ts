import i18next from 'i18next';
import ruLocale from './locales/ru.json' assert { type: 'json' };
import enLocale from './locales/en.json' assert { type: 'json' };

const initI18Next = () =>
  i18next.init({
    lng: 'en',
    resources: {
      en: enLocale,
      ru: ruLocale,
    },
  });

export default initI18Next;
