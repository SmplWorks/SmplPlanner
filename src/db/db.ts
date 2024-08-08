import { batch } from 'solid-js';
import { createStore, type SetStoreFunction } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';
import { SemVer } from 'semver';

import { cloneDate } from '~/utils';

import { type ID, type TaskDef, type OneOffDef } from '~/db/internal';

export type DBDef = {
    tasks: {
        oneOff: OneOffDef[];
    };

    nextId: number;
    lastUpdateDate: Date;
    version: SemVer;
}

export function initialDB(currentVersion: SemVer): DBDef {
    return {
        tasks: {
            oneOff: [],
        },

        nextId: 1,
        lastUpdateDate: new Date(),
        version: currentVersion,
    };
}

export class DB {
    #db: DBDef;
    #setDb: SetStoreFunction<DBDef>;

    constructor(name: string, currentVersion: SemVer) {
        const [db, setDb] = makePersisted(
            createStore<DBDef>(initialDB(currentVersion)),
            {
                name,
                deserialize: (v) => this.deserialize(v, currentVersion),
            },
        );
        this.#db = db;
        this.#setDb = setDb;
    }
    deserialize(v: string, currentVersion: SemVer) {
        const initial = initialDB(currentVersion);

        const parsed = JSON.parse(v) as DBDef;
        if (typeof parsed !== 'object')
            return initial;

        // Compare parsed.version with current version and upgrade if necessary
        if (currentVersion.compare(parsed.version.raw) === -1) {
            alert('Current version is earlier than parsed, by continuing you agree to resetting all your data. Exit this tab to avoid that.');
            return initial;
        }

        parsed.version = currentVersion;

        return parsed;
    }

    #nextId(): ID {
        const nextId = this.#db.nextId;
        this.#setDb('nextId', (nextId) => nextId + 1);
        return nextId.toString();
    }

    #setTaskMetadata(task: TaskDef, _property: string, _newValue: any, currentDate: Date) {
        task.metadata.lastUpdateDate = cloneDate(currentDate);

        switch (task.type) {
        case 'oneOff':
            break;
        }
    }

    getOneOffs(): OneOffDef[] {
        return this.#db.tasks.oneOff;
    }
    getOneOff(taskId: OneOffDef['id']): OneOffDef | null {
        return this.#db.tasks.oneOff.find((task) => task.id === taskId) || null;
    }
    createOneOff(taskDef: Omit<OneOffDef, 'id' | 'type' | 'skippedDate' | 'doneDate' | 'metadata'>, currentDate?: Date): OneOffDef {
        return batch(() => {
            currentDate = currentDate || new Date();

            const task: OneOffDef = {
                ...taskDef,
                id: this.#nextId(),
                type: 'oneOff',

                skippedDate: null,
                doneDate: null,

                metadata: {
                    lastUpdateDate: cloneDate(currentDate),
                    creationDate: cloneDate(currentDate),
                },
            };
            this.#setDb('tasks', 'oneOff', (tasks) => [...tasks, task]);
            this.#setDb('lastUpdateDate', cloneDate(currentDate));
            return task;
        });
    }
    setOneOffProperty<T extends keyof Omit<OneOffDef, 'id' | 'type' | 'metadata'>>(taskId: OneOffDef['id'], property: T, newValue: OneOffDef[T], currentDate?: Date): void {
        currentDate = currentDate || new Date();

        return this.#setDb('tasks', 'oneOff', (task) => task.id === taskId, (_task) => {
            const task = {..._task};
            task[property] = newValue;
            this.#setTaskMetadata(task, property, newValue, currentDate);
            return task;
        });
    }
    deleteOneOff(taskId: OneOffDef['id']) {
        this.#setDb('tasks', 'oneOff', (tasks) => tasks.filter((task) => task.id !== taskId));
    }
}
