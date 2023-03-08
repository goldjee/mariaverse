import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import browserLang from 'browser-lang';

import * as en from './en.json';
import * as ru from './ru.json';

const languages = ['en', 'ru'];
type Language = (typeof languages)[number];

const language = browserLang({
    languages: languages,
    fallback: languages[0],
});

const resources = {
    en: en,
    ru: ru,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as { [key: Language]: any };

void i18n.use(initReactI18next).init({
    resources,
    lng: language,

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
