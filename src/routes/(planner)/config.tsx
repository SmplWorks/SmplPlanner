import { CreateRoutineCard, TaskColumn } from '~/components';
import { useAppContext } from '~/context';

export default function Config() {
    const ctx = useAppContext();

    const routines = () => ctx.db.getRoutines();
    const reset = () => {
        localStorage.clear();
        location.reload();
    };

    return (
        <main>
            <h2>Config</h2>

            <CreateRoutineCard />

            <TaskColumn title='Routine' tasks={routines} />

            <button onClick={reset}>Reset</button>
        </main>
    )
}
