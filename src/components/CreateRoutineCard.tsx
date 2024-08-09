import { createStore } from 'solid-js/store';

import { type DB } from '~/db';
import { useAppContext } from '~/context';
import { withLeadingZero } from '~/utils';

export default function CreateOneOffCard() {
    const ctx = useAppContext();

    const [ props, setProps ] = createStore<Parameters<DB['createRoutine']>[0]>({
        title: '',
        time: {
            hour: 0,
            minute: 0,
        },
    });

    const onCreate = (ev: SubmitEvent) => {
        ev.preventDefault();

        let task = ctx.db.createRoutine({...props, time: {...props.time}});
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

            <input
                type='time' required
                value={`${withLeadingZero(props.time.hour)}:${withLeadingZero(props.time.minute)}`}
                onChange={(ev) => {
                    const [hour, minute] = ev.target.value.split(':');
                    setProps('time', {hour: +hour, minute: +minute});
                }}
            />

            <button>Create</button>
        </form>
    );
}
