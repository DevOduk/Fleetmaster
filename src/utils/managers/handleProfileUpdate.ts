import { updateProfileDetails } from "@/app/actions/main-admin";

async function handleProfileUpdate(
  id,
  profileDetails,
  setBackDrop,
  showToast,
  setProfile,
) {
  setBackDrop(true);
  const res = await updateProfileDetails({ id, profileDetails });

  if (res.success) {
    showToast("Profile was updated successfully!", "success");
    setBackDrop(false);

    setProfile(profileDetails);
  } else {
    showToast(res.error.message, "error");
    setBackDrop(false);
  }
}

export default handleProfileUpdate;
