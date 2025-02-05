import { type Location } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";

import { initialLocale, deserializeLocale, type Locale } from "./locale";
import { initialTheme, deserializeTheme, type Theme } from "./theme";

export {
    type Theme,
    type Locale,
}

export type Settings = {
    locale: Locale,
    theme: Theme,
}

function initialSettings(location: Location): Settings {
    return {
        locale: initialLocale(location),
        theme: initialTheme(),
    };
}

function deserializeSettings(value: string, location: Location): Settings {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") {
        return initialSettings(location);
    }

    return {
        locale: deserializeLocale((parsed as any).locale, location),
        theme: deserializeTheme((parsed as any).theme),
    };
}

export function createSettings(location: Location) {
    const now = new Date();

    return makePersisted(
        createStore(initialSettings(location)),
        {
            name: "settings",
            storage: cookieStorage,
            storageOptions: {
                expires: new Date(now.getFullYear()+1, now.getMonth(), now.getDate()),
                sameSite: "Lax",
            },
            deserialize: (value) => deserializeSettings(value, location),
        },
    );
}
