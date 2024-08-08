import { type TaskDef } from '~/db';
import { useAppContext } from '~/context';

export default function TaskCard(props: { task: TaskDef }) {
    const ctx = useAppContext();

    const setAsDone = () => ctx.db.setOneOffProperty(props.task.id, 'doneDate', new Date());
    const setAsSkipped = () => ctx.db.setOneOffProperty(props.task.id, 'skippedDate', new Date());
    const deleteTask = () => ctx.db.deleteOneOff(props.task.id);

    return (
        <div>
            <span onClick={setAsDone}>{props.task.title}</span>
            {' '}
            <span onClick={setAsSkipped}>S</span>
            {' '}
            <span onClick={deleteTask}>D</span>
        </div>
    );
}
