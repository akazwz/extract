import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  TriangleAlertIcon,
  LoaderIcon,
  RocketIcon,
  ApertureIcon,
  ScanSearchIcon,
  ImageDownIcon,
  UserXIcon,
  ImageOffIcon,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { getLocaleData } from "~/locales/locale";
import LinkWithLang from "~/components/LinkWithLang";
import { LanguageMenu } from "~/components/LanguageMenu";
import { ImageShow } from "~/components/ImageShow";
import type { ExtractImageData } from "~/types";
import { extractImagesFromURL, getBrowser } from "~/lib/extract";
import type { Browser } from "@cloudflare/puppeteer";

interface ActionRespData {
  title?: string;
  error?: {
    message: string;
  };
  images?: ExtractImageData[];
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.localeData.title },
    {
      name: "description",
      content: data?.localeData.description,
    },
  ];
};

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const lang = params?.lang || "en";
  const localeData = await getLocaleData(lang);
  return {
    lang,
    localeData,
  };
}

const featureIcons = [
  <RocketIcon className="size-8 text-blue-500" />,
  <ScanSearchIcon className="size-8 text-blue-500" />,
  <UserXIcon className="size-8 text-blue-500" />,
  <ImageDownIcon className="size-8 text-blue-500" />,
];

export async function action({ request, context, params }: ActionFunctionArgs) {
  const lang = params?.lang || "en";
  const localeData = await getLocaleData(lang);
  const formData = await request.formData();
  const url = formData.get("url");
  if (!url || typeof url !== "string") {
    return {
      error: {
        message: localeData.urlError,
      },
    };
  }
  const { BROWSER, WS_ENDPOINT } = context.cloudflare.env;
  let browser: Browser | undefined;
  try {
    browser = await getBrowser(BROWSER, WS_ENDPOINT);
  } catch (error) {
    return {
      error: {
        message: localeData.browserError,
      },
    };
  }
  if (!browser) {
    return {
      error: {
        message: localeData.browserError,
      },
    };
  }
  try {
    const images = await extractImagesFromURL(browser, url);
    browser.disconnect();
    return {
      images,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error: {
        message: localeData.extractError,
      },
    };
  }
}

export default function Index() {
  const { lang, localeData } = useLoaderData<typeof loader>();

  const actionData = useActionData<ActionRespData>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  return (
    <div className="flex h-dvh flex-col gap-4">
      <header className="mx-auto flex w-full max-w-4xl items-center p-4">
        <LinkWithLang lang={lang} to="/" className="flex items-center gap-2">
          <ApertureIcon />
          <span className="font-bold">Extract</span>
        </LinkWithLang>
        <div className="flex-1" />
        <LanguageMenu />
      </header>
      <div className="mx-auto w-full max-w-xl p-2 text-center">
        <h1 className="text-3xl font-bold">{localeData.title}</h1>
        <p className="p-2 text-sm text-muted-foreground">
          {localeData.description}
        </p>
      </div>
      <main className="mx-auto flex w-full max-w-xl flex-col gap-2 p-4">
        <Form method="POST" className="flex flex-col gap-4 p-2 md:flex-row">
          <Input type="url" name="url" required />
          <Button
            type="submit"
            disabled={submitting}
            data-umami-event="Extract button"
          >
            {submitting && <LoaderIcon className="mx-2 size-4 animate-spin" />}
            <span>{localeData.extractButton}</span>
          </Button>
        </Form>
        {!submitting && actionData?.error && (
          <Alert variant="destructive">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>{localeData.errorTitle}</AlertTitle>
            <AlertDescription>{actionData.error.message}</AlertDescription>
          </Alert>
        )}
      </main>
      {!submitting && actionData?.images && actionData.images.length > 0 && (
        <div className="mx-auto w-full max-w-4xl p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {actionData.images.map((image) => (
              <ImageShow
                key={image.src}
                {...image}
                previewNotAvailable={localeData.previewNotAvailable}
              />
            ))}
          </div>
        </div>
      )}
      {!submitting && actionData?.images && actionData.images.length == 0 && (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 p-2">
          <span className="text-xl font-semibold text-muted-foreground">
            {localeData.noImages}
          </span>
          <ImageOffIcon className="size-24 text-muted-foreground" />
        </div>
      )}
      <div className="mx-auto w-full max-w-xl p-4">
        <div className="grid gap-8">
          {(!actionData?.images ||
            actionData.images.length == 0 ||
            submitting) &&
            localeData.features.map((feature, idx) => (
              <div key={`feature-${idx}`} className="flex gap-4 p-2">
                {featureIcons[idx]}
                <div className="flex flex-1 flex-col gap-4">
                  <span className="font-bold">{feature.title}</span>
                  <span className="text-sm">{feature.description}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      <footer className="mx-auto w-full max-w-4xl p-4">
        <span className="text-xs text-gray-500">
          Powered by{" "}
          <a href="#" className="text-blue-500">
            Extract
          </a>
        </span>
      </footer>
    </div>
  );
}
