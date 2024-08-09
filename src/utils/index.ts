export function cloneDate(date: Date): Date {
    return new Date(date);
}

export function withLeadingZero(n: number): string {
    return `${n < 10 ? '0' : ''}${n}`;
}
