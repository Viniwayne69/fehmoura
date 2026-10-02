import { instagramHandle, whatsappLink } from "@/lib/format";
import type { Settings } from "@/lib/types";
import { Instagram, Mail, Spotify, Whatsapp, Youtube } from "../icons";

export function ContactChannels({ settings }: { settings: Settings }) {
  const wa = whatsappLink(settings.whatsapp, "Oi, Feh! Vim pelo site e quero falar sobre um evento.");
  return (
    <ul className="channels">
      {settings.email && (
        <li><a href={`mailto:${settings.email}`}><Mail />{settings.email}</a></li>
      )}
      {wa && (
        <li><a href={wa} target="_blank" rel="noopener noreferrer"><Whatsapp />Chamar no WhatsApp</a></li>
      )}
      {settings.instagram && (
        <li><a href={settings.instagram} target="_blank" rel="noopener noreferrer"><Instagram />{instagramHandle(settings.instagram)}</a></li>
      )}
      {settings.spotify && (
        <li><a href={settings.spotify} target="_blank" rel="noopener noreferrer"><Spotify />Ouça no Spotify →</a></li>
      )}
      {settings.youtube && (
        <li><a href={settings.youtube} target="_blank" rel="noopener noreferrer"><Youtube />Sets no YouTube →</a></li>
      )}
    </ul>
  );
}
