import i18next from 'i18next';
import ruLocale from './locales/ru.json' assert { type: 'json' };
import enLocale from './locales/en.json' assert { type: 'json' };

const initI18Next = async () => {
  try {
    await i18next.init({
      lng: 'en',
      resources: {
        en: enLocale,
        ru: ruLocale,
      },
    });
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error when initializing i18next: ', error);
  }
};

export default initI18Next;
