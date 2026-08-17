import { sendWelcomeNotification } from "@/app/actions/notifications";
import { Resend } from "resend";
import { EmailChangeNotification } from "../templates/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotificationPayload {
  isFirstTime: boolean;
  userEmail: string;
  tenant: any;
  firstName?: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function triggerPostVerificationNotification({
  isFirstTime,
  userEmail,
  tenant,
  firstName,
}: NotificationPayload) {
  const MAX_TRIALS = 5;
  let tryCount = 0;
  let success = false;

  while (tryCount < MAX_TRIALS) {
    tryCount++;

    const result = isFirstTime
      ? await sendWelcomeNotification(userEmail, tenant, firstName)
      : await sendEmailChangedNotification(userEmail, firstName);

    if (result?.success) {
      success = true;
      break;
    }

    console.warn(
      `Email notification attempt ${tryCount} failed for ${userEmail}.`,
    );

    if (tryCount < MAX_TRIALS) {
      await delay(Math.pow(2, tryCount - 1) * 1000);
    }
  }

  if (!success) {
    console.error(
      `Failed to send notification after ${MAX_TRIALS} attempts to ${userEmail}`,
    );
  }
}

// Transactional notification for email address updates
export async function sendEmailChangedNotification(
  userEmail: string,
  userName?: string,
) {
  const displayName = userName || "there";

  const { data, error: mailError } = await resend.emails.send({
    from: "FleetMaster <security@resend.dev>",
    to: userEmail,
    subject: "Security Alert: FleetMaster Email Updated",
    html: EmailChangeNotification(displayName),
  });

  if (mailError) {
    return { success: false, error: mailError };
  }

  return { success: true, data };
}
