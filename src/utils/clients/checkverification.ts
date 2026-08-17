export default function userVerified(profile: any) {
  const verified =
    profile?.verification_status?.email &&
    profile?.verification_status?.phone &&
    profile?.verification_status?.kra_pin &&
    profile?.verification_status?.national_id &&
    profile?.verification_status?.driving_license;
  return Boolean(verified);
}
