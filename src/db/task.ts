import { type ID } from '~/db/internal';

export const TASK_TYPE = ['oneOff'] as const;
export type TaskType = (typeof TASK_TYPE)[number];

export interface TaskDef {
    id: ID;
    type: TaskType;

    title: string;

    skippedDate: Date | null;

    metadata: {
        creationDate: Date;
        lastUpdateDate: Date,
    };
}

export function taskIsSkipped(task: TaskDef): boolean {
    return task.skippedDate !== null;
}

export type OneOffDef = TaskDef & {
    type: 'oneOff';

    doneDate: Date | null;
}

export const ONEOFF_STATUS = ['todo', 'done'] as const;
export type OneOffStatus = (typeof ONEOFF_STATUS)[number];

export function oneOffCalcStatus(task: OneOffDef): OneOffStatus {
    if (task.doneDate !== null)
        return 'done';
    return 'todo';
}
