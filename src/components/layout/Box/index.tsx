import { mergeProps, splitProps, type ComponentProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { type ElementType } from "~/utils";

import "./box.css";

export const BOX_FILL = ["1", "2", "3"] as const;
export type BoxFill = (typeof BOX_FILL)[number];

export const SIZES = ["xxs", "xs", "s", "m", "l", "xl", "xxl"] as const;
export type Size = (typeof SIZES)[number];

export const BOX_SPACES = ["none", "xxs", "xs", "s", "m", "l", "xl", "xxl"] as const;
export type BoxSpace = (typeof BOX_SPACES)[number];

export const BOX_RADII = ["none", "xxs", "xs", "s", "m", "l", "xl", "xxl", "circle"] as const;
export type BoxRadius = (typeof BOX_RADII)[number];

export type BoxProps<T extends ElementType = "div"> = ComponentProps<T> & {
    as?: T,

    scrollX?: boolean,
    scrollY?: boolean,
    scroll?: boolean,

    fillX?: BoxFill,
    fillY?: BoxFill,
    fill?: boolean,

    paddingL?: BoxSpace,
    paddingR?: BoxSpace,
    paddingT?: BoxSpace,
    paddingB?: BoxSpace,
    paddingX?: BoxSpace,
    paddingY?: BoxSpace,
    padding?: BoxSpace,

    gapX?: BoxSpace,
    gapY?: BoxSpace,
    gap?: BoxSpace,

    radiusTL?: BoxRadius,
    radiusTR?: BoxRadius,
    radiusBL?: BoxRadius,
    radiusBR?: BoxRadius,
    radiusL?: BoxRadius,
    radiusR?: BoxRadius,
    radiusT?: BoxRadius,
    radiusB?: BoxRadius,
    radius?: BoxRadius,
};

export default function Box<T extends ElementType = "div">(props: BoxProps<T>) {
    const [_local, other] = splitProps(props, [
        "as",
        "scrollX", "scrollY", "scroll",
        "fillX", "fillY", "fill",
        "paddingL", "paddingR", "paddingT", "paddingB", "paddingX", "paddingY", "padding",
        "gapX", "gapY", "gap",
        "radiusTL", "radiusTR", "radiusBL", "radiusBR", "radiusL", "radiusR", "radiusT", "radiusB", "radius",
    ]);
    const local = () => mergeProps({
        as: "div",
        scroll: false,
        fill: false,
        padding: "none",
        gap: "none",
        radius: "none",
    } as const, _local);

    const scrollX = (): boolean =>
        local().scrollX || local().scroll;
    const scrollY = (): boolean =>
        local().scrollY || local().scroll;

    const fillX = (): BoxFill | false =>
        local().fillX || (local().fill && "1");
    const fillY = (): BoxFill | false =>
        local().fillY || (local().fill && "1");

    const paddingL = (): BoxSpace | false =>
        local().paddingL || local().paddingX || local().padding;
    const paddingR = (): BoxSpace | false =>
        local().paddingR || local().paddingX || local().padding;
    const paddingT = (): BoxSpace | false =>
        local().paddingT || local().paddingY || local().padding;
    const paddingB = (): BoxSpace | false =>
        local().paddingB || local().paddingY || local().padding;

    const gapX = (): BoxSpace | false =>
        local().gapX || local().gap;
    const gapY = (): BoxSpace | false =>
        local().gapY || local().gap;

    const radiusTL = (): BoxRadius | false =>
        local().radiusTL || local().radiusT || local().radiusL || local().radius;
    const radiusTR = (): BoxRadius | false =>
        local().radiusTR || local().radiusT || local().radiusR || local().radius;
    const radiusBL = (): BoxRadius | false =>
        local().radiusBL || local().radiusB || local().radiusL || local().radius;
    const radiusBR = (): BoxRadius | false =>
        local().radiusBR || local().radiusB || local().radiusR || local().radius;

    const attr = () => [
        scrollX() ? "scrollX" : "",
        scrollY() ? "scrollY" : "",

        fillX() ? `fillX fillX:${fillX()}` : "",
        fillY() ? `fillY fillY:${fillY()}` : "",

        paddingL() ? `paddingL:${paddingL()}` : "",
        paddingR() ? `paddingR:${paddingR()}` : "",
        paddingT() ? `paddingT:${paddingT()}` : "",
        paddingB() ? `paddingB:${paddingB()}` : "",

        gapX() ? `gapX:${gapX()}` : "",
        gapY() ? `gapY:${gapY()}` : "",

        radiusTL() ? `radiusTL:${radiusTL()}` : "",
        radiusTR() ? `radiusTR:${radiusTR()}` : "",
        radiusBL() ? `radiusBL:${radiusBL()}` : "",
        radiusBR() ? `radiusBR:${radiusBR()}` : "",
    ].join(" ");

    return (
        <Dynamic
            component={local().as as ElementType}
            attr:data-smpl-box={attr()}
            {...other}
        />
    )
}
