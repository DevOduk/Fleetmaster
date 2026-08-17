"use client";

import AccountSettings from "@/components/account/AccountSettings";
import { useUser } from "@/context/UserContext";

function AccountSeetingsWarapper({
  currentSetting,
}: {
  currentSetting: string;
}) {
  const { profile, setProfile, loading } = useUser();

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
