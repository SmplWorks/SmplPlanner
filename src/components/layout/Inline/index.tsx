import { mergeProps, splitProps } from "solid-js";

import { Flex, type FlexProps } from "~/components/layout";
import { type ElementType } from "~/utils";

import "./inline.css";

export type InlineProps<T extends ElementType = "div"> = FlexProps<T> & {
    wrap?: boolean,
}

export default function Inline<T extends ElementType = "div">(props: InlineProps<T>) {
    const [_local, flexProps] = splitProps(props, ["wrap"]);
    const local = () => mergeProps({
        wrap: false,
    } as const, _local);

    const attr = () => [
        local().wrap ? "wrap" : "",
    ].join(" ");

    return (
        <Flex<T>
            attr:data-smpl-inline={attr()}
            {...flexProps}
        />
    )
}
