import { CreateTaskCard, TaskColumn } from '~/components';
import { oneOffCalcStatus } from '~/db';
import { useAppContext } from '~/context';

export default function Landing() {
    const ctx = useAppContext();

    const oneOffTodo = () => ctx.db.getOneOffs()
        .filter((task) => task.skippedDate === null && oneOffCalcStatus(task) === 'todo');

    return (
        <main>
            <h1>Ahoy there!</h1>
            <h2>{ctx.version.toString()}</h2>

            <CreateTaskCard />

            <TaskColumn title='To-Do' tasks={oneOffTodo} />
        </main>
    )
}
