"use client";
import UserInfoCard from "@/components/ProfilePage/client-profile/UserInfoCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useUser } from "@/context/UserContext";
import UserAddressCard from "../admin-profile/UserAddressCard";
import UserMetaCard from "../admin-profile/UserMetaCard";
import LoadingInfo from "@/components/loading/LoadingInfo";
import { usePathname, useSearchParams } from "next/navigation";

function ProfilePage() {
  const { profile, loading } = useUser();
  const pathname = usePathname();
  const searchString = useSearchParams().toString();
  const currentPageUrl = encodeURIComponent(
    searchString ? btoa(`${pathname}?${searchString}`) : btoa(pathname),
  );

  if (loading) {
    return (<LoadingInfo />);

  } else if (!profile) {
    window.location.href = `/signin?r=${currentPageUrl}`;
    return (
      <div className="container mx-auto min-h-[80vh] p-5 text-gray-400">
        Redirecting to signin ...
      </div>
    );
  }

  return (
    <div>
      <div className="container m-auto min-h-screen">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
          <PageBreadcrumb pageTitle="View Profile" />

          <div className="space-y-6">
            <UserMetaCard />
            <UserInfoCard />
            <UserAddressCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
