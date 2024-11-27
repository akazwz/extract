import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button, ButtonProps } from "~/components/ui/button";

interface CopyButtonProps extends ButtonProps {
  content: string;
  deplay?: number;
}

export type CopyStatus = "idle" | "success" | "error";

const copyStatusIcons = {
  idle: <CopyIcon />,
  success: <CheckIcon className="text-green-500" />,
  error: <ExclamationTriangleIcon className="text-red-500" />,
};

export function CopyButton(props: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  async function copyToClipboard(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setTimeout(() => {
        setStatus("idle");
      }, props.deplay || 1000);
    }
  }

  return (
    <Button
      onClick={() => copyToClipboard(props.content)}
      disabled={status !== "idle"}
      size="icon"
      variant="ghost"
      {...props}
    >
      {copyStatusIcons[status]}
    </Button>
  );
}
