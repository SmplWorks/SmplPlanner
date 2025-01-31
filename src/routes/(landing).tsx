import { useAppContext } from "../context";

export default function Home() {
    const { t } = useAppContext();

    return (
        <main>
            <h1>{t("global.greet")}</h1>
        </main>
    );
}
