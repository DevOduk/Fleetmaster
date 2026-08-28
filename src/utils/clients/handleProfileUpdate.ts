import { updateProfileDetails } from "@/app/actions/client";

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

    setProfile({...cleanProfile, fleetmaster_tenants});
  } else {
    showToast(res.error.message, "error");
    setBackDrop(false);
  }
}

export default handleProfileUpdate;
