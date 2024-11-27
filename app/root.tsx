import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { ColorScheme, ColorSchemeScript } from "~/lib/color-schema";
import "~/tailwind.css";
import { sessionCookie, sessionWraper } from "~/sessions.server";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  try {
    const { getSession, commitSession } = sessionWraper(
      context.cloudflare.env.KV,
    );
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const cookie = await sessionCookie.parse(cookieHeader);
    const headers = new Headers();
    if (!cookie) {
      headers.append("Set-Cookie", await commitSession(session));
    }
    const sessionLang = session.get("lang");
    // 跳转到用户请求头的语言
    if (!sessionLang && !params.lang) {
      // zh en
      const langFromHeader = request.headers
        .get("Accept-Language")
        ?.split(",")[0]
        .split("-")[0];
      if (langFromHeader !== "en") {
        return redirect(`/${langFromHeader}`, {
          headers,
        });
      }
    }
    const paramLang = params.lang || "en";
    if (sessionLang && sessionLang !== paramLang) {
      if (sessionLang !== "en") {
        return redirect(`/${sessionLang}`, {
          headers,
        });
      }
      return redirect("/", {
        headers,
      });
    }
    let colorScheme: ColorScheme = "light";
    return json(
      {
        colorScheme,
        lang: params.lang || "en",
      },
      {
        headers,
      },
    );
  } catch (error) {
    console.error(error);
    return {
      colorScheme: "light",
      lang: "en",
    };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme, lang } = useLoaderData<typeof loader>();
  return (
    <html lang={lang} className={colorScheme}>
      <head>
        <ColorSchemeScript />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          defer
          src="https://u.pexni.com/script.js"
          data-website-id="4c31f6b0-3382-4854-b256-15071256ecb3"
          data-domains="extract.fun"
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
