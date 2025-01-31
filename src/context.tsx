import { MetaProvider, Title } from "@solidjs/meta";
import { createContext, useContext, Suspense, type ParentProps } from 'solid-js';
import { parse as parseSemver, type SemVer } from 'semver';

type AppCtx = {
    get version(): SemVer;
}

const AppContext = createContext<AppCtx>();
export const useAppContext = () => useContext(AppContext)!;

export default function AppContextProvider(props: ParentProps) {
    const currentVersion = parseSemver(APP_VERSION + (import.meta.env.DEV ? '-dev' : ''))!;

    const ctx: AppCtx = {
        version: currentVersion,
    };

    return (
        <AppContext.Provider value={ctx}>
            <MetaProvider>
                <Title>SmplPlanner</Title>
                <a href="/">Index</a>

                <div id='AppContext'>
                    <Suspense>{props.children}</Suspense>
                </div>
            </MetaProvider>
        </AppContext.Provider>
    );
}
