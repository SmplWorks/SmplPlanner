// SEE: https://github.com/solidjs/solid-site/blob/1bb2ed684acae0ac036e4338d73786393e96b86c/src/AppContext.tsx
import { createResource, type Accessor } from "solid-js";
import { type Location } from "@solidjs/router";
import { translator, flatten, resolveTemplate, type Flatten } from "@solid-primitives/i18n";

import { dict as en_dict } from "../../i18n/en";

type RawDictionary = typeof en_dict;

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_DIRS = ["ltr", "rtl"] as const;
export type LocaleDir = (typeof LOCALE_DIRS)[number];

/*
for validating of other dictionaries have same keys as en dictionary
some might be missing, but the shape should be the same
*/
type DeepPartial<T> = T extends Record<string, unknown> ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

const raw_dict_map: Record<Locale, () => Promise<{ dict: DeepPartial<RawDictionary> }>> = {
    en: () => null as any, // en is loaded by default
    es: () => import("../../i18n/es"),
};

export type Dictionary = Flatten<RawDictionary>;

export const en_flat_dict: Dictionary = flatten(en_dict);

export async function fetchDictionary(locale: Locale): Promise<Dictionary> {
    if (locale === "en") return en_flat_dict;

    const { dict } = await raw_dict_map[locale]();
    const flat_dict = flatten(dict) as RawDictionary;
    return { ...en_flat_dict, ...flat_dict };
}

// Some browsers do not map correctly to some locale code
// due to offering multiple locale code for similar language (e.g. tl and fil)
// This object maps it to correct `langs` key
const LANG_ALIASES: Partial<Record<string, Locale>> = {
};

export const toLocale = (string: string): Locale | undefined =>
    string in raw_dict_map
        ? (string as Locale)
        : string in LANG_ALIASES
            ? (LANG_ALIASES[string] as Locale)
            : undefined;

export function initialLocale(location: Location): Locale {
    let locale: Locale | undefined;

    locale = toLocale(location.query.locale as string);
    if (locale) return locale;

    locale = toLocale(navigator.language.slice(0, 2));
    if (locale) return locale;

    locale = toLocale(navigator.language.toLocaleLowerCase());
    if (locale) return locale;

    return "en";
}

export function deserializeLocale(locale: any, location: Location): Locale {
    return (typeof locale === "string" && toLocale(locale)) || initialLocale(location);
}

export function createTranslator(locale: Accessor<Locale>) {
    const [ dict ] = createResource(locale, fetchDictionary, { initialValue: en_flat_dict, });
    return translator(dict, resolveTemplate);
}

export type Translator = ReturnType<typeof createTranslator>;
