import { createCookie } from "@remix-run/cloudflare";

export const userPrefs = createCookie("user-prefs", {
  maxAge: 604_800,
});

export const userLang = createCookie("user-lang", {
  maxAge: 604_800,
});
