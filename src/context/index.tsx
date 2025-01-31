import { createContext, useContext, Suspense, type ParentProps, createResource, createEffect, startTransition } from "solid-js";
import { useLocation, type Location } from "@solidjs/router";
import { Meta, MetaProvider, Title } from "@solidjs/meta";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { resolveTemplate, translator, type Translator } from "@solid-primitives/i18n";
import { parse as parseSemver, type SemVer } from "semver";

import { en_flat_dict, fetchDictionary, initialLocale, toLocale, type Dictionary, type Locale } from "./locale";
import { createStore } from "solid-js/store";

interface Settings {
    locale: Locale;
}

function initialSettings(location: Location): Settings {
    return {
        locale: initialLocale(location),
    };
}

function deserializeSettings(value: string, location: Location): Settings {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== 'object') {
        return initialSettings(location);
    }

    return {
      locale: ('locale' in parsed && typeof parsed.locale === 'string' && toLocale(parsed.locale)) || initialLocale(location),
    };
}

interface AppCtx {
    get version(): SemVer;

    get locale(): Locale;
    setLocale(newLocale: Locale): void;
    t: Translator<Dictionary>;
}

const AppContext = createContext<AppCtx>();
export const useAppContext = () => useContext(AppContext)!;

export default function AppContextProvider(props: ParentProps) {
    const currentVersion = parseSemver(APP_VERSION + (import.meta.env.DEV ? "-dev" : ""))!;
    const location = useLocation();

    const now = new Date();
    const [ settings, set ] = makePersisted(createStore(initialSettings(location)), {
        storageOptions: {
            expires: new Date(now.getFullYear()+1, now.getMonth(), now.getDate()),
            sameSite: "Lax",
        },
        storage: cookieStorage,
        deserialize: (value) => deserializeSettings(value, location),
    });

    const locale = () => settings.locale;
    const [ dict ] = createResource(locale, fetchDictionary, { initialValue: en_flat_dict });
    createEffect(() => {
        document.documentElement.lang = settings.locale;
    });

    const t = translator(dict, resolveTemplate);

    const ctx: AppCtx = {
        version: currentVersion,

        get locale() {
            return settings.locale;
        },
        setLocale(newLocale) {
            void startTransition(() => {
                set("locale", newLocale);
            });
        },
        t,
    };

    if (import.meta.env.DEV) {
        // @ts-expect-error
        window.ctx = ctx;
    }

    return (
        <AppContext.Provider value={ctx}>
            <MetaProvider>
                <Title>{t("global.title")}</Title>
                <Meta name="lang" content={locale()} />

                <div id="AppContext">
                    <a href="/">Index</a>
                    <Suspense>{props.children}</Suspense>
                </div>
            </MetaProvider>
        </AppContext.Provider>
    );
}
