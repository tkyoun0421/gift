import { createClient } from "@/shared/lib/supabase/server";
import AdminSidebar from "@/widgets/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={userData} />

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
