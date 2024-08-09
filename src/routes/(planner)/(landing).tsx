import { CreateOneOffCard, TaskColumn } from '~/components';
import { oneOffCalcStatus, oneOffIsSkipped, routineCalcStatus, routineIsSkipped } from '~/db';
import { useAppContext } from '~/context';

export default function Landing() {
    const ctx = useAppContext();

    const oneOffTodo = () => ctx.db.getOneOffs()
        .filter((task) => !oneOffIsSkipped(task) && oneOffCalcStatus(task) === 'todo');
    const routineTodo = () => ctx.db.getRoutines()
        .filter((task) => !routineIsSkipped(task) && routineCalcStatus(task) === 'todo');

    return (
        <main>
            <h2>Home</h2>

            <CreateOneOffCard />

            <TaskColumn title='Routine' tasks={routineTodo} hideDelete />
            <TaskColumn title='Backlog' tasks={oneOffTodo} />
        </main>
    )
}
