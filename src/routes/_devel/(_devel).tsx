import { type ParentProps } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Stack, Text } from "~/components/layout";
import { useAppContext } from "~/context";

export default function DevelLayout(props: ParentProps) {
    const ctx = useAppContext();
    const { t } = ctx;

    if (!import.meta.env.DEV) {
        const navigate = useNavigate();
        navigate("/", { replace: true });
    }

    return (
        <Stack fill>
            <Text type="h1">{t("_devel.page.title")}</Text>
            {props.children}
        </Stack>
    )
}
