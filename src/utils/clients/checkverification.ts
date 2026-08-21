export function userVerified(profile: any) {
  const verified =
    profile?.verification_status?.email &&
    profile?.verification_status?.phone &&
    profile?.verification_status?.national_id &&
    profile?.verification_status?.driving_license;
  return Boolean(verified);
}
export function adminUserVerified(profile: any) {
  const verified =
    profile?.verification_status?.email &&
    profile?.verification_status?.phone &&
    profile?.verification_status?.national_id &&
    profile?.verification_status?.driving_license;
  return Boolean(verified);
}

export default { adminUserVerified, userVerified };