import { Show } from 'solid-js';

import { type TaskDef } from '~/db';
import { useAppContext } from '~/context';

export default function TaskCard(props: {
    task: TaskDef;
    hideDelete?: boolean;
}) {
    const ctx = useAppContext();

    const setAsDone = () => {
        switch (props.task.type) {
        case 'oneOff':
            ctx.db.setOneOffProperty(props.task.id, 'doneDate', new Date());
            break;
        case 'routine':
            ctx.db.setRoutineProperty(props.task.id, 'lastDoneDate', new Date());
            break;
        }
    };
    const setAsSkipped = () => {
        switch (props.task.type) {
        case 'oneOff':
            ctx.db.setOneOffProperty(props.task.id, 'skippedDate', new Date());
            break;
        case 'routine':
            ctx.db.setRoutineProperty(props.task.id, 'lastSkippedDate', new Date());
            break;
        }
    };
    const deleteTask = () => {
        switch (props.task.type) {
        case 'oneOff':
            ctx.db.deleteOneOff(props.task.id);
            break;
        case 'routine':
            ctx.db.deleteRoutine(props.task.id);
            break;
        }
    };

    return (
        <div>
            <span onClick={setAsDone}>{props.task.title}</span>
            {' '}
            <span onClick={setAsSkipped}>S</span>
            <Show when={!props.hideDelete}>{(_) => (<>
                {' '}
                <span onClick={deleteTask}>D</span>
            </>)}</Show>
        </div>
    );
}
