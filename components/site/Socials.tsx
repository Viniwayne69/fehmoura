import type { Settings } from "@/lib/types";
import { Instagram, Spotify, Youtube } from "../icons";

export function Socials({ settings }: { settings: Settings }) {
  const items = [
    { href: settings.instagram, label: "Instagram", Icon: Instagram },
    { href: settings.youtube, label: "YouTube", Icon: Youtube },
    { href: settings.spotify, label: "Spotify", Icon: Spotify },
  ].filter((i) => i.href);
  if (!items.length) return null;
  return (
    <div className="socials">
      {items.map(({ href, label, Icon }) => (
        <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <Icon />
        </a>
      ))}
    </div>
  );
}
