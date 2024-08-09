import { A } from '@solidjs/router';
import type { ParentProps } from 'solid-js';

import { useAppContext } from '~/context';

export default function Planner(props: ParentProps) {
    const ctx = useAppContext();

    return (
        <div>
            <header>
                <h1>SmplPlanner</h1>
                <p>{ctx.version.toString()}</p>
                <nav>
                    <A href='/'>Home</A>
                    {' '}
                    <A href='./config'>Config</A>
                </nav>
            </header>

            {props.children}
        </div>
    )
}
