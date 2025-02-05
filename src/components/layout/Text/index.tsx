import { mergeProps, splitProps, type ParentProps } from "solid-js";

import { Box, type BoxProps } from "~/components/layout";

import "./text.css";

export const TEXT_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6", "span", "a", "sub", "sup", "ins", "del", "mark"] as const; // TODO: Other tags
export type TextTag = (typeof TEXT_TAGS)[number];

export const TEXT_TYPES = ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "body", "callout", "label", "caption", "overline"] as const;
export type TextType = (typeof TEXT_TYPES)[number];

export const TEXT_CASE = ["normal", "lower", "upper", "capitalize"] as const;
export type TextCase = (typeof TEXT_CASE)[number];

export type TextProps<T extends TextTag = "span"> = ParentProps<BoxProps<T>> & {
    type?: TextType,
    bold?: boolean,
    italic?: boolean,
    wrap?: boolean,
    case?: TextCase,
}

export default function Text<T extends TextTag = "span">(props: TextProps<T>) {
    const [_local, boxProps] = splitProps(props, ["as", "type", "bold", "italic", "wrap", "case"]);
    const local = () => mergeProps({
        as: undefined,
        type: TEXT_TYPES.includes(_local.as as TextType) ? _local.as : "body",
        bold: false,
        italic: false,
        wrap: false,
        case: "normal",
    } as const, _local);

    const boxAs = () =>
        local().as ? local().as : TEXT_TAGS.includes(local().type as TextTag) ? local().type : "span";

    const attr = () => [
        `as:${boxAs()}`,
        `type:${local().type}`,
        local().bold ? "bold" : "",
        local().italic ? "italic" : "",
        local().wrap ? "wrap" : "",
        `case:${local().case}`,
    ].join(" ");

    return (
        <Box<T> /* TODO: Type error */
            as={boxAs()}
            attr:data-smpl-text={attr()}
            {...boxProps}
        />
    )
}
