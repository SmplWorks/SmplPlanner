import { createStore } from 'solid-js/store';

import { type DB } from '~/db';
import { useAppContext } from '~/context';

export default function CreateOneOffCard() {
    const ctx = useAppContext();

    const [ props, setProps ] = createStore<Parameters<DB['createRoutine']>[0]>({
        title: '',
    });

    const onCreate = (ev: SubmitEvent) => {
        ev.preventDefault();

        let task = ctx.db.createRoutine(structuredClone({...props}));
        if (task === null)
            alert('Could not create task');
    };

    return (
        <form onSubmit={onCreate}>
            <input
                type='text' required
                value={props.title}
                onChange={(ev) => setProps('title', ev.target.value)}
            />

            <button>Create</button>
        </form>
    );
}
