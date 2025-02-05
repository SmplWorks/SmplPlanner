import { type JSX, type Component } from 'solid-js';

export type ElementType = keyof JSX.IntrinsicElements | Component<any>;
