import { DownloadIcon, EyeOffIcon } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { ExtractImageData } from "~/types";
import { CopyButton } from "~/components/CopyButton";
import { Button } from "~/components/ui/button";
import { downloadImage, readablizeBytes } from "~/lib/file";
import { Badge } from "~/components/ui/badge";

export function ImageShow({
  src,
  size,
  mimeType,
  width,
  height,
  decoded,
  previewNotAvailable,
}: ExtractImageData & {
  previewNotAvailable: string;
}) {
  const [notAvailable, setNotAvailable] = useState(!decoded);

  let ext = mimeType.split("/")[1];
  if (ext === "svg+xml") {
    ext = "svg";
  }
  let name = src.split("/").pop() || "image";

  const img = new Image();
  img.src = src;
  img.onerror = () => {
    setNotAvailable(true);
  };

  return (
    <div className="w-full p-1">
      <div className="relative mb-2">
        <Badge
          variant="secondary"
          className="absolute right-0 top-0 rounded-t-none rounded-br-none"
        >
          {width} x {height}
        </Badge>
        {notAvailable ? (
          <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md bg-yellow-100">
            <EyeOffIcon />
            <span className="text-sm">{previewNotAvailable}</span>
          </div>
        ) : (
          <img
            src={src}
            className="aspect-square w-full rounded-md border border-zinc-200 object-contain"
          />
        )}
      </div>
      <span className="text-sm">
        {name.length > 20 ? name.slice(0, 20) + "..." : name}
      </span>
      <div className="flex items-center gap-1">
        <Badge
          variant="outline"
          className={clsx("px-1", {
            "bg-green-200": ext === "png",
            "bg-purple-200": ext === "gif",
            "bg-zinc-200": ext === "svg",
            "bg-yellow-200": ext === "ico",
            "bg-blue-200": ext === "jpeg",
          })}
        >
          {ext}
        </Badge>
        <Badge variant="outline" className="px-1">
          {readablizeBytes(size)}
        </Badge>
        <div className="flex-1" />
        <CopyButton content={src} />
        <Button size="icon" variant="ghost" onClick={() => downloadImage(src)}>
          <DownloadIcon />
        </Button>
      </div>
    </div>
  );
}
