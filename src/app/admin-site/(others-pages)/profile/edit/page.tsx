import EditSystemUserCard from "@/components/ProfilePage/admin-profile/EditSystemUserCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function Profile() {
  return (
    <div className="container m-auto min-h-screen max-w-6xl">
      <PageBreadcrumb
        items={[
          {
            label: "Profile",
            href: "/profile",
          },
        ]}
        pageTitle="Edit Profile"
      />

      <div className="space-y-6">
        <EditSystemUserCard />
      </div>
    </div>
  );
}
