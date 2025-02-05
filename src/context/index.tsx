import {
    Suspense,
    createContext, useContext, createEffect, startTransition,
    type ParentProps,
} from "solid-js";
import { useLocation } from "@solidjs/router";
import { Meta, MetaProvider, Title } from "@solidjs/meta";
import { parse as parseSemver, type SemVer } from "semver";

import { Inline } from "~/components/layout";

import { createTranslator, type Locale, type LocaleDir, type Translator } from "./locale";
import { createSettings, type Theme } from "./settings";
import "./reset.css";
import "./smpl-base.css";
import "./app.css";

type AppCtx = {
    get version(): SemVer;

    get locale(): Locale;
    get localeDir(): LocaleDir;
    get t(): Translator;
    setLocale(newLocale: Locale): void;

    get theme(): Theme;
    setTheme(newTheme: Theme): void;
}

const AppContext = createContext<AppCtx>();
export const useAppContext = () => useContext(AppContext)!;

export default function AppContextProvider(props: ParentProps) {
    const location = useLocation();

    const currentVersion = parseSemver(APP_VERSION + (import.meta.env.DEV ? "-dev" : ""))!;
    const [ settings, set ] = createSettings(location);

    createEffect(() => {
        document.documentElement.lang = settings.locale;
    });
    createEffect(() => {
        document.documentElement.setAttribute("data-theme", settings.theme);
    });

    const t = createTranslator(() => settings.locale);

    const ctx: AppCtx = {
        version: currentVersion,

        get locale() {
            return settings.locale;
        },
        get localeDir() {
            return t("global.locale.dir") === "rtl" ? "rtl" : "ltr";
        },
        setLocale(newLocale) {
            startTransition(() => set("locale", newLocale));
        },
        t,

        get theme() {
            return settings.theme;
        },
        setTheme(newTheme) {
            startTransition(() => set("theme", newTheme));
        },
    };

    if (import.meta.env.DEV) {
        // @ts-expect-error
        window.ctx = ctx;
    }

    return (
        <MetaProvider>
            <Suspense>
                <AppContext.Provider value={ctx}>
                    <Title>{t("global.site.title")} · {t("global.site.subtitle")}</Title>
                    <Meta name="lang" content={ctx.locale} />

                    <Inline
                        id="AppContext"
                        dir={ctx.localeDir}
                        style={{"width": "100vw", "height": "100vh"}}
                    >
                        {props.children}
                    </Inline>
                </AppContext.Provider>
            </Suspense>
        </MetaProvider>
    );
}
