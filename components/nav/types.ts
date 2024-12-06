import {LucideIcon} from "lucide-react";

export type HeaderAction = {
  name: string;
  url: string | null;
  icon: LucideIcon;
  func: (() => void) | null;
}