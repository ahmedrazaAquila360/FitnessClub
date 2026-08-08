import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M14 8.5h-1.5c-.8 0-1.5.7-1.5 1.5v2h3l-.4 3h-2.6v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" strokeLinecap="round" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="9" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8 12v5" strokeLinecap="round" />
      <path d="M12 17v-3.2c0-1.1.9-1.8 1.9-1.8s1.6.7 1.6 1.8V17" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v5" strokeLinecap="round" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path
        d="M14 3.5c.5 2 2 3.4 4 3.6"
        strokeLinecap="round"
      />
      <path
        d="M14 3.5v11.8a3.7 3.7 0 1 1-3.2-3.66"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path
        d="M6.5 17.5L4.5 20l2.6-.7a8 8 0 1 0-2.9-3.3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10c0 3.5 2.5 6 6 6 .4 0 .8-.3.8-.9v-1c0-.3-.2-.5-.5-.6l-1.7-.5c-.3-.1-.5 0-.7.2l-.5.6c-1-.5-1.8-1.3-2.3-2.3l.6-.5c.2-.2.3-.4.2-.7l-.5-1.7c-.1-.3-.3-.5-.6-.5h-1c-.6 0-.9.4-.9.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SOCIAL_ICON_MAP: Record<string, (props: IconProps) => React.JSX.Element> = {
  INSTAGRAM: InstagramIcon,
  FACEBOOK: FacebookIcon,
  TWITTER: XIcon,
  YOUTUBE: YoutubeIcon,
  LINKEDIN: LinkedinIcon,
  TIKTOK: TiktokIcon,
  WHATSAPP: WhatsappIcon,
};
