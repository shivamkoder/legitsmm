"use client";

import { useRouter } from "next/navigation";
import {
  SiInstagram,
  SiYoutube,
  SiTiktok,
  SiTelegram,
  SiFacebook,
  SiX,
  SiSpotify,
} from "react-icons/si";
import { DropdownMenu } from "@/components/servicedrop";

export function ServicesMenu() {
  const router = useRouter();

  // /protected redirects to /auth/login when signed out (see lib/supabase/proxy.ts)
  const go = () => router.push("/protected");

  const options = [
    { label: "Instagram", Icon: <SiInstagram className="h-4 w-4" style={{ color: "#E1306C" }} />, onClick: go },
    { label: "YouTube", Icon: <SiYoutube className="h-4 w-4" style={{ color: "#FF0000" }} />, onClick: go },
    { label: "TikTok", Icon: <SiTiktok className="h-4 w-4" style={{ color: "#FFFFFF" }} />, onClick: go },
    { label: "Telegram", Icon: <SiTelegram className="h-4 w-4" style={{ color: "#2AABEE" }} />, onClick: go },
    { label: "Facebook", Icon: <SiFacebook className="h-4 w-4" style={{ color: "#1877F2" }} />, onClick: go },
    { label: "X", Icon: <SiX className="h-4 w-4" style={{ color: "#FFFFFF" }} />, onClick: go },
    { label: "Spotify", Icon: <SiSpotify className="h-4 w-4" style={{ color: "#1DB954" }} />, onClick: go },
  ];

  return <DropdownMenu options={options}>Services</DropdownMenu>;
}
