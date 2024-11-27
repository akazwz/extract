export async function getLocaleData(lang: string) {
  switch (lang) {
    case "en":
      return import("./en.json").then((m) => m.default);
    case "zh":
      return import("./zh.json").then((m) => m.default);
    default:
      return import("./en.json").then((m) => m.default);
  }
}
