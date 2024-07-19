import languages from "../data/languages.json";

export const getLanguageLabelByCode = (code: string): string => {
  return languages.find((language) => language.code === code)!.label;
};
