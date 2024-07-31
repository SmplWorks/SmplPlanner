import { createContext, useContext, type ParentProps } from 'solid-js';
import { parse as parseSemver, type SemVer } from 'semver';

type AppCtx = {
    get version(): SemVer;
}

const AppContext = createContext<AppCtx>();
export const useAppContext = () => useContext(AppContext)!;

export default function AppContextProvider(props: ParentProps) {
    //@ts-expect-error // TODO
    const currentVersion = parseSemver(APP_VERSION + (import.meta.env.DEV ? '-dev' : ''))!;

    const ctx: AppCtx = {
        version: currentVersion,
    };

    return (
        <AppContext.Provider value={ctx}>
            <div id='AppContext'>
                {props.children}
            </div>
        </AppContext.Provider>
    );
}
