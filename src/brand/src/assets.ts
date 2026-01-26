export type PeerIconName =
  | "peer-icon-1"
  | "peer-icon-2"
  | "peer-icon-3"
  | "peer-icon-4"
  | "peer-icon-5"
  | "peer-icon-6"
  | "peer-icon-7"
  | "peer-icon-8"
  | "peer-icon-9"
  | "peer-icon-10"
  | "peer-icon-11"
  | "peer-icon-12"
  | "peer-icon-13"
  | "peer-icon-14"
  | "peer-icon-15"
  | "peer-icon-16"
  | "peer-icon-17"
  | "peer-icon-18"
  | "peer-icon-19"
  | "peer-icon-20";

export type LogoVariant = "colour" | "white" | "black";

export const peerIconNames: PeerIconName[] = [
  "peer-icon-1",
  "peer-icon-2",
  "peer-icon-3",
  "peer-icon-4",
  "peer-icon-5",
  "peer-icon-6",
  "peer-icon-7",
  "peer-icon-8",
  "peer-icon-9",
  "peer-icon-10",
  "peer-icon-11",
  "peer-icon-12",
  "peer-icon-13",
  "peer-icon-14",
  "peer-icon-15",
  "peer-icon-16",
  "peer-icon-17",
  "peer-icon-18",
  "peer-icon-19",
  "peer-icon-20",
];

export const iconPaths: Record<PeerIconName, string> = {
  "peer-icon-1": new URL("../icons/peer-icon-1.svg", import.meta.url).href,
  "peer-icon-2": new URL("../icons/peer-icon-2.svg", import.meta.url).href,
  "peer-icon-3": new URL("../icons/peer-icon-3.svg", import.meta.url).href,
  "peer-icon-4": new URL("../icons/peer-icon-4.svg", import.meta.url).href,
  "peer-icon-5": new URL("../icons/peer-icon-5.svg", import.meta.url).href,
  "peer-icon-6": new URL("../icons/peer-icon-6.svg", import.meta.url).href,
  "peer-icon-7": new URL("../icons/peer-icon-7.svg", import.meta.url).href,
  "peer-icon-8": new URL("../icons/peer-icon-8.svg", import.meta.url).href,
  "peer-icon-9": new URL("../icons/peer-icon-9.svg", import.meta.url).href,
  "peer-icon-10": new URL("../icons/peer-icon-10.svg", import.meta.url).href,
  "peer-icon-11": new URL("../icons/peer-icon-11.svg", import.meta.url).href,
  "peer-icon-12": new URL("../icons/peer-icon-12.svg", import.meta.url).href,
  "peer-icon-13": new URL("../icons/peer-icon-13.svg", import.meta.url).href,
  "peer-icon-14": new URL("../icons/peer-icon-14.svg", import.meta.url).href,
  "peer-icon-15": new URL("../icons/peer-icon-15.svg", import.meta.url).href,
  "peer-icon-16": new URL("../icons/peer-icon-16.svg", import.meta.url).href,
  "peer-icon-17": new URL("../icons/peer-icon-17.svg", import.meta.url).href,
  "peer-icon-18": new URL("../icons/peer-icon-18.svg", import.meta.url).href,
  "peer-icon-19": new URL("../icons/peer-icon-19.svg", import.meta.url).href,
  "peer-icon-20": new URL("../icons/peer-icon-20.svg", import.meta.url).href,
};

export const logoPaths: Record<LogoVariant, string> = {
  colour: new URL("../logos/peer-logo-colour.svg", import.meta.url).href,
  white: new URL("../logos/peer-logo-white.svg", import.meta.url).href,
  black: new URL("../logos/peer-logo-black.svg", import.meta.url).href,
};

export const getIconUrl = (name: PeerIconName | string) => {
  const direct = iconPaths[name as PeerIconName];
  if (direct) {
    return direct;
  }

  if (name.includes("/") || name.includes(".svg")) {
    return name;
  }

  return `/icons/${name}.svg`;
};

export const getLogoUrl = (variant: LogoVariant = "colour") =>
  logoPaths[variant];
