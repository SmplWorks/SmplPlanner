import { batch } from 'solid-js';
import { createStore, type SetStoreFunction } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';
import { SemVer } from 'semver';

import { cloneDate } from '~/utils';

import { type ID, type TaskDef, type OneOffDef, type RoutineDef } from '~/db/internal';

export type DBDef = {
    tasks: {
        oneOff: OneOffDef[];
        routine: RoutineDef[];
    };

    nextId: number;
    lastUpdateDate: Date;
    version: SemVer;
}

export function initialDB(currentVersion: SemVer): DBDef {
    return {
        tasks: {
            oneOff: [],
            routine: [],
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

        parsed.tasks.oneOff.forEach((task) => {
            task.doneDate = task.doneDate && new Date(task.doneDate);
            task.skippedDate = task.skippedDate && new Date(task.skippedDate);

            task.metadata.creationDate = task.metadata.creationDate && new Date(task.metadata.creationDate);
            task.metadata.lastUpdateDate = task.metadata.lastUpdateDate && new Date(task.metadata.lastUpdateDate);
        });

        parsed.tasks.routine.forEach((task) => {
            task.lastDoneDate = task.lastDoneDate && new Date(task.lastDoneDate);
            task.lastSkippedDate = task.lastSkippedDate && new Date(task.lastSkippedDate);

            task.metadata.creationDate = task.metadata.creationDate && new Date(task.metadata.creationDate);
            task.metadata.lastUpdateDate = task.metadata.lastUpdateDate && new Date(task.metadata.lastUpdateDate);
        });

        return parsed;
    }

    #nextId(): ID {
        const nextId = this.#db.nextId;
        this.#setDb('nextId', (nextId) => nextId + 1);
        return nextId.toString();
    }

    #getTasks<T extends OneOffDef | RoutineDef>(type: TaskDef['type']): T[] {
        return this.#db.tasks[type] as T[];
    }
    #getTask<T extends OneOffDef | RoutineDef>(taskId: T['id'], type: TaskDef['type']): T | null {
        return (this.#db.tasks[type].find((task) => task.id === taskId) as T) || null;
    }
    #createTask<T extends OneOffDef | RoutineDef>(taskDef: Omit<T, 'id' | 'metadata'>, currentDate?: Date): T {
        return batch(() => {
            currentDate = currentDate || new Date();

            const task: T = {
                ...taskDef,
                id: this.#nextId(),

                metadata: {
                    lastUpdateDate: cloneDate(currentDate),
                    creationDate: cloneDate(currentDate),
                },
            } as T;
            this.#setDb('tasks', task.type, (tasks) => [...tasks, task] as any);
            this.#setDb('lastUpdateDate', cloneDate(currentDate));
            return task;
        });
    }
    #setTaskProperty<T extends OneOffDef | RoutineDef, K extends keyof Omit<T, 'id' | 'type' | 'metadata'>>(taskId: T['id'], property: K, newValue: T[K], type: TaskDef['type'], currentDate?: Date): void {
        currentDate = currentDate || new Date();

        return batch(() => {
            this.#setDb('lastUpdateDate', cloneDate(currentDate));
            this.#setDb('tasks', type, (task) => task.id === taskId, (_task) => {
                const task = {..._task} as T;
                task[property] = newValue;
                task.metadata.lastUpdateDate = cloneDate(currentDate);

                switch (task.type) {
                case 'oneOff':
                    break;
                case 'routine':
                    break;
                }

                return task;
            });
        });
    }
    #deleteTask(taskId: TaskDef['id'], type: TaskDef['type'], currentDate?: Date): void {
        currentDate = currentDate || new Date();

        return batch(() => {
            this.#setDb('lastUpdateDate', cloneDate(currentDate));
            this.#setDb('tasks', type, (tasks) => tasks.filter((task) => task.id !== taskId) as any);
        });
    }

    getOneOffs(): OneOffDef[] {
        return this.#getTasks('oneOff') as OneOffDef[];
    }
    getOneOff(taskId: OneOffDef['id']): OneOffDef | null {
        return this.#getTask(taskId, 'oneOff') as OneOffDef | null;
    }
    createOneOff(taskDef: Omit<OneOffDef, 'id' | 'type' | 'skippedDate' | 'doneDate' | 'metadata'>, currentDate?: Date): OneOffDef {
        return this.#createTask({
            ...taskDef,
            type: 'oneOff',

            skippedDate: null,
            doneDate: null,
        }, currentDate);
    }
    setOneOffProperty<T extends keyof Omit<OneOffDef, 'id' | 'type' | 'metadata'>>(taskId: OneOffDef['id'], property: T, newValue: OneOffDef[T], currentDate?: Date): void {
        return this.#setTaskProperty(taskId, property, newValue, 'oneOff', currentDate);
    }
    deleteOneOff(taskId: OneOffDef['id'], currentDate?: Date): void {
        return this.#deleteTask(taskId, 'oneOff', currentDate);
    }

    getRoutines(): RoutineDef[] {
        return (this.#getTasks('routine') as RoutineDef[]).toSorted((a, b) => {
            if (a.time.hour < b.time.hour)
                return -1;
            else if (b.time.hour < a.time.hour)
                return 1;
            else if (a.time.minute < b.time.minute)
                return -1;
            else if (b.time.minute < a.time.minute)
                return 1;
            else return 0;
        });
    }
    getRoutine(taskId: RoutineDef['id']): RoutineDef | null {
        return this.#getTask(taskId, 'routine') as RoutineDef | null;
    }
    createRoutine(taskDef: Omit<RoutineDef, 'id' | 'type' | 'lastDoneDate' | 'lastSkippedDate' | 'metadata'>, currentDate?: Date): RoutineDef {
        return this.#createTask({
            ...taskDef,
            type: 'routine',

            lastDoneDate: null,
            lastSkippedDate: null,
        }, currentDate);
    }
    setRoutineProperty<T extends keyof Omit<RoutineDef, 'id' | 'type' | 'metadata'>>(taskId: RoutineDef['id'], property: T, newValue: RoutineDef[T], currentDate?: Date): void {
        return this.#setTaskProperty(taskId, property, newValue, 'routine', currentDate);
    }
    deleteRoutine(taskId: RoutineDef['id'], currentDate?: Date): void {
        return this.#deleteTask(taskId, 'routine', currentDate);
    }
}
