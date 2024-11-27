import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { sessionWraper } from "~/sessions.server";

export async function action({ request, context, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const lang = formData.get("lang") as string;
  if (!lang || (lang !== "en" && lang !== "zh")) {
    return null;
  }
  const { KV } = context.cloudflare.env;
  const { getSession, commitSession } = sessionWraper(KV);
  const session = await getSession(request.headers.get("Cookie"));
  session.set("lang", lang);
  await commitSession(session);
  if (lang === "en") {
    return redirect("/");
  }
  return redirect(`/${lang}`);
}
