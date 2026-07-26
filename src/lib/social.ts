import type { SocialLink } from "@/types/database";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Send,
  Music2,
  MessageCircle,
  Globe,
} from "lucide-react";

const ICON_MAP = {
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  youtube: Youtube,
  telegram: Send,
  tiktok: Music2,
  whatsapp: MessageCircle,
  website: Globe,
} as const;

const LABEL_MAP = {
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X (Twitter)",
  youtube: "YouTube",
  telegram: "Telegram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  website: "Website",
} as const;

export function getSocialIcon(platform: SocialLink["platform"]) {
  return ICON_MAP[platform] || Globe;
}

export function getSocialLabel(platform: SocialLink["platform"]) {
  return LABEL_MAP[platform] || platform;
}