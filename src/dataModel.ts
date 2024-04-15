import { Faker, fakerEN, az, cs_CZ, de, de_AT, de_CH, en, en_AU, en_AU_ocker, en_CA, en_GB, en_IE, en_IN, en_US, es, es_MX, fa, fr, fr_CA, id_ID, it, ja, ko, nb_NO, nl, pl, pt_BR, ru, sk, sv, tr, uk, vi, zh_CN, zh_TW } from "@faker-js/faker";

let faker = fakerEN;
let currentLocale = "en";

const getLocaleDefinition = (locale: string) => {
  switch (locale) {
    case "az":
      return az;
    case "cs_CZ":
      return cs_CZ;
    case "de":
      return de;
    case "de_AT":
      return de_AT;
    case "de_CH":
      return de_CH;
    case "en":
      return en;
    case "en_AU":
      return en_AU;
    case "en_AU_ocker":
      return en_AU_ocker;
    case "en_CA":
      return en_CA;
    case "en_GB":
      return en_GB;
    case "en_IE":
      return en_IE;
    case "en_IN":
      return en_IN;
    case "en_US":
      return en_US;
    case "es":
      return es;
    case "es_MX":
      return es_MX;
    case "fa":
      return fa;
    case "fr":
      return fr;
    case "fr_CA":
      return fr_CA;
    case "id_ID":
      return id_ID;
    case "it":
      return it;
    case "ja":
      return ja;
    case "ko":
      return ko;
    case "nb_NO":
      return nb_NO;
    case "nl":
      return nl;
    case "pl":
      return pl;
    case "pt_BR":
      return pt_BR;
    case "ru":
      return ru;
    case "sk":
      return sk;
    case "sv":
      return sv;
    case "tr":
      return tr;
    case "uk":
      return uk;
    case "vi":
      return vi;
    case "zh_CN":
      return zh_CN;
    case "zh_TW":
      return zh_TW;
    default: return en;
  }
}

const setLocale = (locale: string) => {
  faker = new Faker({ locale: getLocaleDefinition(locale) });
  currentLocale = locale;
};

const generate = (pattern: string) => {
  if (!pattern) return "";
  return faker.person.firstName() + " :: " + pattern;
};

export {
  setLocale,
  generate,
}