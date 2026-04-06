"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, getStoredUser, clearSession } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "SOPs", icon: "📋", exact: true },
  { href: "/dashboard/record", label: "Record", icon: "🎥", exact: false },
  { href: "/dashboard/team", label: "Team", icon: "👥", exact: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; permission: string } | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    setUser(getStoredUser());
  }, [router]);

  function handleSignOut() {
    clearSession();
    router.push("/");
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#7F77DD", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: "#7F77DD" }}
          >
            P
          </div>
          <span className="font-bold text-gray-900">Primer</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={active ? { backgroundColor: "#7F77DD" } : {}}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + signout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="px-3 py-2 flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-900 truncate">{user.name}</span>
            <span className="text-xs text-gray-400 capitalize">{user.permission.toLowerCase()}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-1 w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
