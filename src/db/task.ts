import { areSameDay } from '~/utils/date';

import { type ID } from '~/db/internal';

export const TASK_TYPE = ['oneOff', 'routine'] as const;
export type TaskType = (typeof TASK_TYPE)[number];

export interface TaskDef {
    id: ID;
    type: TaskType;

    title: string;

    metadata: {
        creationDate: Date;
        lastUpdateDate: Date,
    };
}

export type OneOffDef = TaskDef & {
    type: 'oneOff';

    doneDate: Date | null;
    skippedDate: Date | null;
}

export const TASK_STATUS = ['todo', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUS)[number];

export function oneOffIsSkipped(task: OneOffDef): boolean {
    return task.skippedDate !== null;
}

export function oneOffCalcStatus(task: OneOffDef): TaskStatus {
    if (task.doneDate !== null)
        return 'done';
    return 'todo';
}

export type RoutineDef = TaskDef & {
    type: 'routine';

    time: {
        hour: number;
        minute: number;
    };

    lastDoneDate: Date | null;
    lastSkippedDate: Date | null;
}

export function routineCalcStatus(task: RoutineDef, currentDate?: Date): TaskStatus {
    currentDate = currentDate || new Date();
    if (task.lastDoneDate !== null && areSameDay(task.lastDoneDate, currentDate))
        return 'done';
    return 'todo';
}

export function routineIsSkipped(task: RoutineDef, currentDate?: Date): boolean {
    currentDate = currentDate || new Date();
    return task.lastSkippedDate !== null && areSameDay(task.lastSkippedDate, currentDate);
}
