import { mergeProps, splitProps, type ParentProps } from "solid-js";

import { Box, type BoxProps } from "~/components/layout";
import { type ElementType } from "~/utils";

import "./flex.css";

export const FLEX_SPACES = ["none", "between", "around", "evenly"] as const;
export type FlexSpace = (typeof FLEX_SPACES)[number];

export const FLEX_ALIGN = ["top-left", "top-center", "top-right", "middle-left", "middle-center", "middle-right", "bottom-left", "bottom-center", "bottom-right"] as const;
export type FlexAlign = (typeof FLEX_ALIGN)[number];

export type FlexProps<T extends ElementType = "div"> = ParentProps<BoxProps<T> & {
    space?: FlexSpace,
    align?: FlexAlign,
}>;

export default function Flex<T extends ElementType = "div">(props: FlexProps<T>) {
    const [_local, boxProps] = splitProps(props, ["space", "align"]);
    const local = () => mergeProps({
        space: "none",
        align: "top-left",
    } as const, _local);

    const attr = () => [
        `space:${local().space}`,
        `alignX:${local().align.split("-")[1]}`,
        `alignY:${local().align.split("-")[0]}`,
    ].join(" ");

    return (
        <Box<T> /* TODO: Type error */
            attr:data-smpl-flex={attr()}
            {...boxProps}
        />
    )
}
