import { en } from "./en";
import { vi } from "./vi";

export type Language = "en" | "vi";

export const translations = {
  en,
  vi
};

export const getTranslation = (lang: Language) => {
  return translations[lang];
};