import { updateProfileDetails } from "@/app/actions/admin";

async function handleProfileUpdate(
  id,
  profileDetails,
  setBackDrop,
  showToast,
  setProfile,
) {
  setBackDrop(true);

  const { fleetmaster_tenants, ...cleanProfile } = profileDetails;
  const res = await updateProfileDetails({ id, profileDetails: cleanProfile });

  if (res.success) {
    showToast("Profile was updated successfully!", "success");
    setBackDrop(false);

    setProfile({fleetmaster_tenants, ...cleanProfile});
  } else {
    showToast(res.error.message, "error");
    setBackDrop(false);
  }
}

export default handleProfileUpdate;
