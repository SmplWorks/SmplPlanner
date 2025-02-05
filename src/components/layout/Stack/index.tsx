import { Flex, type FlexProps } from "~/components/layout";
import { type ElementType } from "~/utils";

import "./stack.css";

export type StackProps<T extends ElementType = "div"> = FlexProps<T>;

export default function Stack<T extends ElementType = "div">(props: StackProps<T>) {
    return (
        <Flex<T>
            attr:data-smpl-stack
            {...props}
        />
    )
}
