import AdminSidebarClient from "@/widgets/AdminSidebarClient";
import { headers } from "next/headers";

interface User {
  id: string;
  name: string;
  role: string;
}

interface Stats {
  today: number;
  total: number;
}

interface AdminSidebarProps {
  user: User;
}

async function getSidebarStats(): Promise<Stats> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}/api/applicant?page=1&limit=1&status=all`, {
    next: { tags: ["applicants"] },
  });
  if (!res.ok) return { today: 0, total: 0 };
  const data = await res.json();
  return (data?.stats as Stats) ?? { today: 0, total: 0 };
}

export default async function AdminSidebar({ user }: AdminSidebarProps) {
  const stats = await getSidebarStats();
  return <AdminSidebarClient user={user} stats={stats} />;
}
