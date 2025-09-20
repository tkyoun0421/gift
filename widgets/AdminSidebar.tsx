import AdminSidebarClient from "@/widgets/AdminSidebarClient";
import { getApplicantStats } from "@/features/applicant/actions";
import { getCurrentUserServer } from "@/features/auth/actions/getCurrentUserServer";

export default async function AdminSidebar() {
  const userData = await getCurrentUserServer();
  const stats = await getApplicantStats();

  return <AdminSidebarClient user={userData} stats={stats} />;
}
