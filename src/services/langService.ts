const LS_LANGUAGE_STORE = "LS_LANGUAGE_STORE";

export const getLanguage = () =>
  localStorage.getItem(LS_LANGUAGE_STORE) ?? "it";

export const setLanguage = (lang = "it") =>
  localStorage.setItem(LS_LANGUAGE_STORE, lang);
