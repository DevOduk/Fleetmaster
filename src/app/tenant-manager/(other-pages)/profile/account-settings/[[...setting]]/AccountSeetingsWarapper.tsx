"use client";

import AccountSettings from "@/components/account/AccountSettings";
import { useAdmin } from "@/context/AdminContext";

function AccountSeetingsWarapper({
  currentSetting,
}: {
  currentSetting: string;
}) {
  const {
    adminProfile: profile,
    setAdminProfile: setProfile,
    loading,
  } = useAdmin();

  return (
    <AccountSettings
      profile={profile}
      setProfile={setProfile}
      loading={loading}
      currentSetting={currentSetting}
    />
  );
}

export default AccountSeetingsWarapper;
