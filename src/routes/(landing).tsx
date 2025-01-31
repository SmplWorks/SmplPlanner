import { useAppContext } from "~/context";

export default function Home() {
    const { db, t } = useAppContext();

    return (
        <main>
            <h1>{t("global.greet")}</h1>
            <button onClick={() => db.getUser()}>Get User</button>
            <button onClick={() => db.signIn("superfederico@gmail.com", "Testing!2#")}>Sign In</button>
            <button onClick={() => db.signOut()}>Sign Out</button>
            <button onClick={() => db.getTest()}>Get Test</button>
            <button onClick={() => db.putTest()}>Put Test</button>
        </main>
    );
}
