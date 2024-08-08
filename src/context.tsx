import { createContext, useContext, type ParentProps } from 'solid-js';
import { parse as parseSemver, type SemVer } from 'semver';

import { DB } from '~/db';

type AppCtx = {
    get db(): DB;
    get version(): SemVer;
}

const AppContext = createContext<AppCtx>();
export const useAppContext = () => useContext(AppContext)!;

export default function AppContextProvider(props: ParentProps) {
    //@ts-expect-error // TODO
    const currentVersion = parseSemver(APP_VERSION + (import.meta.env.DEV ? '-dev' : ''))!;

    const ctx: AppCtx = {
        db: new DB('db', currentVersion),
        version: currentVersion,
    };

    if (import.meta.env.DEV) //@ts-expect-error
        window.ctx = ctx;

    return (
        <AppContext.Provider value={ctx}>
            <div id='AppContext'>
                {props.children}
            </div>
        </AppContext.Provider>
    );
}
