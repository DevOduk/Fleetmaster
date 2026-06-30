// src/app/admin-site/(others-pages)/system-users/page.tsx
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import SystemUsers from "@/components/bookings/SystemUsers";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS...",
};

async function getAdmins() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('fleetmaster_main_admins')
      .select('id, phone, email, bio, first_name, last_name, role, profile_pic, created_at');

    if (error) {
      console.error("Supabase Error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Failed to fetch admins:", err);
    return [];
  }
}

export default async function Page() {
  const admins = await getAdmins();

  // const manyAdmins = admins.concat(admins,admins,admins,admins,admins,admins,admins,admins,admins,admins,admins,admins,admins,admins,admins);

  return (
    <div>
      <PageBreadcrumb pageTitle="System Users" />
      {/* Pass loading as false because by the time this renders, the server data is already fetched */}
      <SystemUsers initialUsers={admins} loading={false} />
    </div>
  );
}