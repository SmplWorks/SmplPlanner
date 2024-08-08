import { For, type Accessor } from 'solid-js';

import { TaskCard } from '~/components';
import { type TaskDef } from '~/db';

export default function TaskColumn(props: { title: string, tasks: Accessor<TaskDef[]> }) {
    return (
        <div>
            <h2>{props.title}</h2>
            <For each={props.tasks()}>{(task) => <TaskCard task={task} />}</For>
        </div>
    )
}
