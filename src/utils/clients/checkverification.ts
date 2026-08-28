interface VerificationProfile {
  verification_status?: {
    email?: boolean;
    phone?: boolean;
    national_id?: boolean;
    driving_license?: boolean;
  };
}

export function userVerified(profile: VerificationProfile) {
  const verified =
    profile?.verification_status?.email &&
    profile?.verification_status?.phone &&
    profile?.verification_status?.national_id &&
    profile?.verification_status?.driving_license;
  return Boolean(verified);
}
export function adminUserVerified(profile: VerificationProfile) {
  const verified =
    profile?.verification_status?.email &&
    profile?.verification_status?.phone &&
    profile?.verification_status?.national_id &&
    profile?.verification_status?.driving_license;
  return Boolean(verified);
}

export default { adminUserVerified, userVerified };