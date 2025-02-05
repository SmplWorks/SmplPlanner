import { createResource, Show, Suspense } from "solid-js";
import { useAppContext } from "~/context";

function UserData() {
    const { db } = useAppContext();
    const [ user, { mutate, refetch } ] = createResource(db.getUser);

    return (
        <div>
            <h3>User Data</h3>
                <Show
                    when={user()}
                    fallback={<>
                        <p>Error loading user</p>
                        <button onClick={() => db.signIn("superfederico@gmail.com", "Testing!2#")}>Sign In</button>
                    </>}
                >{(user) => (<>
                    <p>Email: {user().email}</p>
                    <button onClick={() => db.signOut()}>Sign Out</button>
                </>)}</Show>
        </div>
    );
}

export default function Home() {
    const { db, t } = useAppContext();

    return (
        <main>
            <h1>{t("global.greet")}</h1>

            <UserData />
        </main>
    );
}
