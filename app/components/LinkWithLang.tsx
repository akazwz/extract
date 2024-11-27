import { LinkProps, Link } from "@remix-run/react";

interface LinkWithLangProps extends LinkProps {
  lang?: string;
}

export default function LinkWithLang(props: LinkWithLangProps) {
  let { lang, to } = props;
  switch (lang) {
    case "zh":
      to = `/zh${to}`;
      if (to.endsWith("/")) {
        to = to.slice(0, -1);
      }
      break;
  }
  return <Link {...props} to={to} />;
}
