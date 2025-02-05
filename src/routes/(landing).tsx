import { Stack, Text } from "~/components/layout";
import { useAppContext } from "~/context";

export default function Home() {
    const ctx = useAppContext();
    const { t } = ctx;

    return (
        <Stack fill>
            <Text type="h1">{t("global.site.title")}</Text>
        </Stack>
    );
}
