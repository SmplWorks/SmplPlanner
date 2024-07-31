import { useAppContext } from '~/context';

export default function Landing() {
    const ctx = useAppContext();

    return (
        <main>
            <h1>Ahoy there!</h1>
            <h2>{ctx.version.toString()}</h2>
        </main>
    )
}
