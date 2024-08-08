import { createStore } from 'solid-js/store';

import { type TaskDef, type OneOffDef } from '~/db';
import { useAppContext } from '~/context';

export default function CreateTaskCard() {
    const ctx = useAppContext();

    const [ props, setProps ] = createStore<{
        common: Pick<TaskDef, 'title'>;
        type: TaskDef['type'];
        oneOff: Omit<OneOffDef, keyof TaskDef | 'doneDate'>;
    }>({
        common: {
            title: '',
        },
        type: 'oneOff',
        oneOff: {},
    });

    const onCreate = (ev: SubmitEvent) => {
        ev.preventDefault();

        let task: TaskDef | null = null;
        switch (props.type) {
        case 'oneOff':
            task = ctx.db.createOneOff(structuredClone({...props.common, ...props.oneOff}));
            break;
        }

        if (task === null)
            alert('Could not create task');
    };

    return (
        <form onSubmit={onCreate}>
            <input
                type='text' required
                value={props.common.title}
                onChange={(ev) => setProps('common', 'title', ev.target.value)}
            />

            <button>Create</button>
        </form>
    );
}
