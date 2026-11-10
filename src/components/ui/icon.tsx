import {
  Anchor, Bot, Building2, Car, CircleHelp, Crosshair, Eye, Flame, Gamepad2, Gem, KeyRound, Lightbulb, Map, MapPin,
  Newspaper, Plane, Rocket, ScrollText, Settings, Sparkles, Sunset, Target, TreePalm, Trophy, UserRound, Users, Wallet,
  Waves, Wrench, type LucideIcon, type LucideProps,
} from "lucide-react";
import type { IconName } from "@/types/content";

const icons: Record<IconName, LucideIcon> = {
  lightbulb: Lightbulb, map: Map, target: Target, key: KeyRound, users: Users, bot: Bot, newspaper: Newspaper, car: Car,
  crosshair: Crosshair, wallet: Wallet, gamepad: Gamepad2, user: UserRound, settings: Settings, rocket: Rocket,
  sparkles: Sparkles, gem: Gem, trophy: Trophy, help: CircleHelp, wrench: Wrench, scroll: ScrollText, mappin: MapPin,
  palm: TreePalm, waves: Waves, sunset: Sunset, building: Building2, plane: Plane, anchor: Anchor, flame: Flame, eye: Eye,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = icons[name];
  return <Cmp aria-hidden="true" {...props} />;
}
