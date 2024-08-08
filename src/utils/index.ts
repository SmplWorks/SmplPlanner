import { createStore } from 'solid-js/store';

export function storify<T extends object>(someClassInstance: T) {
    const [ store ] = createStore(someClassInstance);
    return store;
}

export function cloneDate(date: Date): Date {
    return new Date(date);
}
