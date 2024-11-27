import { LanguagesIcon, LoaderIcon } from "lucide-react";
import { useFetcher, useNavigation, useParams } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { useDebouncedValue } from "~/hooks/useDebouncedValue";

export function LanguageMenu() {
  const params = useParams();
  const lang = params.lang || "en";
  const fetcher = useFetcher({ key: "userLang" });

  const navigation = useNavigation();
  let isLoading =
    navigation.state === "loading" || navigation.formAction === "/api/userLang";

  function setLang(lang: string) {
    fetcher.submit(
      {
        lang,
      },
      {
        action: "/api/userLang",
        method: "POST",
      },
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={useDebouncedValue(isLoading, 1000)}
        >
          {useDebouncedValue(isLoading, 1000) ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <LanguagesIcon />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          onClick={() => setLang("en")}
          checked={lang === "en"}
        >
          English
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          onClick={() => setLang("zh")}
          checked={lang === "zh"}
        >
          简体中文
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
