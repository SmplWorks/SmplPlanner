import { Show } from 'solid-js';

import { type RoutineDef, type TaskDef } from '~/db';
import { useAppContext } from '~/context';
import { withLeadingZero } from '../utils';

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
            <Show when={props.task.type === 'routine'}>{(_) => (<>
                <span>{withLeadingZero((props.task as RoutineDef).time.hour)}:{withLeadingZero((props.task as RoutineDef).time.minute)}</span>
                {' '}
            </>)}</Show>
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
