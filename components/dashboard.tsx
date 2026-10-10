"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";
import {
  ShoppingCart,
  ListPlus,
  Layers,
  Bell,
  Sparkles,
  ShoppingBag,
  CircleDollarSign,
  Users,
  Store,
  Code,
  Headset,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
};

// One flat list, in the same order as the reference panel. No group headings.
const navItems: NavItemData[] = [
  { id: "new-order", title: "New order", icon: ShoppingCart },
  { id: "mass-order", title: "Mass order", icon: ListPlus },
  { id: "services", title: "Services", icon: Layers },
  { id: "updates", title: "Updates", icon: Bell },
  { id: "recommended", title: "AI Recommended Services", icon: Sparkles },
  { id: "orders", title: "Orders", icon: ShoppingBag },
  { id: "add-funds", title: "Add funds", icon: CircleDollarSign },
  { id: "affiliates", title: "Affiliates", icon: Users },
  { id: "child-panel", title: "Child panel", icon: Store },
  { id: "api", title: "API", icon: Code },
  { id: "tickets", title: "Tickets", icon: Headset },
];

const logoutItem: NavItemData = { id: "logout", title: "Log out", icon: LogOut };

function NavItem({
  item,
  activeId,
  onSelect,
}: {
  item: NavItemData;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const isActive = activeId === item.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-current={isActive ? "page" : undefined}
      className={`group flex w-full items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none text-left
        ${
          isActive
            ? "bg-black/5 dark:bg-white/10 text-foreground font-medium"
            : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground/90"
        }
      `}
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <item.icon
          className={`w-[16px] h-[16px] shrink-0 transition-colors ${
            isActive
              ? "text-foreground"
              : "text-muted-foreground/70 group-hover:text-foreground/70"
          }`}
          strokeWidth={1.5}
        />
        <span className="text-[13px] tracking-wide truncate">{item.title}</span>
      </span>
      {item.badge && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
          {item.badge}
        </span>
      )}
    </button>
  );
}

export function SidebarNav({
  className = "",
  activeId,
  onSelect,
}: {
  className?: string;
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const [internalId, setInternalId] = useState("new-order");
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;

  return (
    <nav
      className={`flex flex-col w-[260px] h-full bg-card/50 border-r border-border/50 p-3 font-sans ${className}`}
    >
      <div className="px-2.5 py-3 mb-3 text-[15px] font-semibold tracking-tight text-foreground">
        Legit SMM
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            activeId={currentId}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/50">
        <NavItem item={logoutItem} activeId={currentId} onSelect={handleSelect} />
      </div>
    </nav>
  );
}

export default function SidebarNavPreview() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState("new-order");
  const router = useRouter();

  const activeTitle =
    navItems.find((i) => i.id === activeId)?.title ?? "Dashboard";

  const handleSelect = async (id: string) => {
    if (id === "logout") {
      await createClient().auth.signOut();
      router.push("/auth/login");
      return;
    }
    setActiveId(id);
  };

  return (
    <div className="h-full w-full bg-background">
      <div className="relative flex h-full w-full overflow-hidden bg-card">
        <div
          className={`h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-card/50 border-r border-border/50 ${
            isOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 border-none"
          }`}
        >
          <SidebarNav
            className="w-[260px] border-none bg-transparent"
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>

        <div className="flex-1 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col min-w-0 transition-all duration-300">
          <div className="h-14 border-b border-border/50 flex items-center px-4 justify-between bg-card shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
              >
                {isOpen ? (
                  <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} />
                ) : (
                  <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />
                )}
              </button>
              <span className="text-sm font-medium text-foreground truncate">
                {activeTitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full border border-primary/20" />
            </div>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center justify-between mb-8">
              <div className="w-48 h-8 bg-black/5 dark:bg-white/5 rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="h-32 bg-card rounded-xl border border-border/50 shadow-sm" />
              <div className="h-32 bg-card rounded-xl border border-border/50 shadow-sm" />
            </div>

            <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <div className="w-1/3 h-5 bg-black/5 dark:bg-white/5 rounded-md mb-6" />
              <div className="w-full h-[1px] bg-border/50 mb-6" />
              <div className="flex flex-col gap-4">
                {[0, 1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
