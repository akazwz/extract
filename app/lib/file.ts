export function readablizeBytes(bytes: number) {
  if (isNaN(bytes)) return "0 B";
  if (bytes === 0) return "0 B";
  const s = ["B", "KB", "MB", "GB", "TB", "PB"];
  let e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, e)).toFixed(0) + " " + s[e];
}

export async function downloadImage(url: string) {
  const resp = await fetch(url, {
    referrerPolicy: "no-referrer",
    mode: "no-cors",
  });
  const blob = await resp.blob();
  const a = document.createElement("a");
  const href = URL.createObjectURL(blob);
  a.href = href;
  a.download = url.split("/").pop() || "image";
  a.click();
  URL.revokeObjectURL(href);
}
