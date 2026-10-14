"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import React, { useState, useEffect, useRef } from "react";
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
  Wallet,
  ChevronDown,
  Plus,
} from "lucide-react";
import { StatsCard } from "@/components/statscard";
import { PlatformFilter } from "@/components/platformfilter";
import { OrderForm } from "@/components/orderform";
import { AddFunds } from "@/components/addfunds";
import { Orders } from "@/components/orders";
import { Services } from "@/components/services";

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
      className={`group flex w-full items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-colors duration-200 select-none text-left outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60
        ${
          isActive
            ? "bg-[#7FFF00]/10 text-[#7FFF00] font-medium"
            : "text-[#7FFF00]/60 hover:bg-[#7FFF00]/5 hover:text-[#7FFF00]"
        }
      `}
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <item.icon
          className={`w-[16px] h-[16px] shrink-0 transition-colors ${
            isActive
              ? "text-[#7FFF00]"
              : "text-[#7FFF00]/50 group-hover:text-[#7FFF00]"
          }`}
          strokeWidth={1.5}
        />
        <span className="text-[13px] tracking-wide truncate">{item.title}</span>
      </span>
      {item.badge && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-[#7FFF00]/15 text-[#7FFF00]">
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
      className={`flex flex-col w-[260px] h-full bg-black border-r border-[#7FFF00]/15 p-3 font-sans ${className}`}
    >
      <div className="mb-3 flex items-center gap-1.5 px-2.5 py-3 text-[15px] font-semibold tracking-tight text-[#7FFF00]">
            <img src="@/components/legit-logo.png" alt="Legit" className="h-5 w-auto" />
        <span>SMM</span>
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

      <div className="mt-auto pt-4 border-t border-[#7FFF00]/15">
        <NavItem item={logoutItem} activeId={currentId} onSelect={handleSelect} />
      </div>
    </nav>
  );
}

function HeaderActions({ onSelect }: { onSelect: (id: string) => void }) {
  const [open, setOpen] = useState<"wallet" | "profile" | null>(null);
  const [email, setEmail] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const balance = 0; // replace with real balance from Supabase later

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = email ? email[0].toUpperCase() : "U";
  const menuClass =
    "absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#7FFF00]/20 bg-[#050a02] p-2 shadow-lg z-50";

  return (
    <div ref={ref} className="flex items-center gap-3">
      {/* Wallet */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "wallet" ? null : "wallet")}
          className="flex items-center gap-1.5 outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60 rounded-full"
          aria-label="Wallet"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7FFF00]/15 border border-[#7FFF00]/30">
            <Wallet className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.5} />
          </span>
          <span className="text-sm font-medium text-[#7FFF00]">
            ${balance}
          </span>
          <ChevronDown className="h-4 w-4 text-[#7FFF00]/60" />
        </button>

        {open === "wallet" && (
          <div className={menuClass}>
            <div className="px-2 py-2">
              <p className="text-xs text-[#7FFF00]/60">Balance</p>
              <p className="text-lg font-semibold text-[#7FFF00]">${balance}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(null);
                onSelect("add-funds");
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-[13px] text-[#7FFF00] hover:bg-[#7FFF00]/10"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Add funds
            </button>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "profile" ? null : "profile")}
          className="flex items-center gap-1.5 outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60 rounded-full"
          aria-label="Profile"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#7FFF00]/15 border border-[#7FFF00]/30 text-sm font-semibold text-[#7FFF00]">
            {initial}
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#7FFF00] ring-2 ring-black" />
          </span>
          <ChevronDown className="h-4 w-4 text-[#7FFF00]/60" />
        </button>

        {open === "profile" && (
          <div className={menuClass}>
            <div className="px-2 py-2 border-b border-[#7FFF00]/15 mb-1">
              <p className="text-xs text-[#7FFF00]/60">Signed in as</p>
              <p className="truncate text-[13px] text-[#7FFF00]">
                {email || "..."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect("logout")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-[13px] text-[#7FFF00] hover:bg-[#7FFF00]/10"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SidebarNavPreview() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState("new-order");
  const [platform, setPlatform] = useState("all");
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
    <div className="h-full w-full bg-black text-[#7FFF00]">
      <div className="relative flex h-full w-full overflow-hidden bg-black">
        {/* Sidebar */}
        <div
          className={`h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-black border-r border-[#7FFF00]/15 ${
            isOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 border-none"
          }`}
        >
          <SidebarNav
            className="w-[260px] border-none bg-transparent"
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>

        {/* Main area */}
        <div className="flex-1 bg-black flex flex-col min-w-0 transition-all duration-300">
          {/* Top bar */}
          <div className="h-14 border-b border-[#7FFF00]/15 flex items-center px-4 justify-between bg-black shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                className="p-1.5 rounded-md text-[#7FFF00]/60 hover:bg-[#7FFF00]/10 hover:text-[#7FFF00] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#7FFF00]/60"
              >
                {isOpen ? (
                  <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} />
                ) : (
                  <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />
                )}
              </button>
              <span className="text-sm font-medium text-[#7FFF00] truncate">
                {activeTitle}
              </span>
            </div>

            <HeaderActions onSelect={handleSelect} />
          </div>

          {/* Page content */}
          <div className="flex-1 min-h-0 p-6 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {activeId === "new-order" ? (
              <>
                <div className="mb-6">
                  <StatsCard onNavigate={handleSelect} />
                </div>

                <div className="mb-6">
                  <PlatformFilter value={platform} onChange={setPlatform} />
                </div>

                <div className="w-full rounded-xl border border-[#7FFF00]/15 bg-[#050a02] p-5 md:p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <OrderForm />
                    {/* Step 4: service details panel goes here */}
                    <div />
                  </div>
                </div>
              </>
            ) : activeId === "add-funds" ? (
              <AddFunds />
            ) : activeId === "orders" ? (
              <Orders />
                ) :activeId === "services" ? (
  <Services onNavigate={handleSelect} />
) : 
              
              
              (
              <div className="flex h-64 items-center justify-center rounded-xl border border-[#7FFF00]/15 bg-[#050a02] text-sm text-[#7FFF00]/60">
                {activeTitle} page coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
