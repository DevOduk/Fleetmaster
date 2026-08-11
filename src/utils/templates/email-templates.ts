export function WelcomeEmail(displayName: string) {
  const appUrl = 'http://app.localhost:3000';
  return `
    <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to FleetMaster, ${displayName}!</h2>
      <p style="color: #334155; font-size: 16px; line-height: 24px;">
        We are thrilled to have you on board. FleetMaster helps you streamline vehicle management, tracking, and operational tasks seamlessly.
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 24px;">
        Get started by checking out your dashboard to manage your fleet efficiently.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${appUrl}/dashboard" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        If you have any questions, reply directly to this email—our support team is ready to help.
      </p>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      This email has been auto-generated
      </p>
    </div>
  `;
}

export function ClientWelcomeEmail(displayName: string, tenant: any) {
  const appUrl = `http://${tenant.slug}.localhost:3000`;
  return `
    <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to ${tenant.name}, ${displayName}!</h2>
      <p style="color: #334155; font-size: 16px; line-height: 24px;">
        We are thrilled to have you on board. ${tenant.name} gives you the best rental experience from economy cars to classic cars all at great prices.
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 24px;">
        Get started by making your first booking fast, easy and efficiently <a href="${appUrl}/vehicles" style="color: blue;">Here</a>.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${appUrl}" style="background-color: blue; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none; display: inline-block; width: 100%;">
          Visit website
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        If you have any questions, open your account and create a support ticket and our support will help you.
      </p>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      This email has been auto-generated
      </p>
    </div>
  `;
}

export function EmailChangeNotification(displayName: string) {
  return `
      <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Email address updated</h2>
        <p style="color: #334155; font-size: 16px; line-height: 24px;">
          Hello ${displayName}, your email address for your FleetMaster account was successfully verified and updated.
        </p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
          If you did not perform this change, please contact support immediately.
        </p>
      </div>
    `;
}

export function VerifyEmailNotification(otp: string, otpValidityMinutes: number) {
  return `
        <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Verify your identity</h2>
          <p style="color: #334155; font-size: 16px; line-height: 24px;">Use the following security code to complete your verification request. This code is active for ${otpValidityMinutes} minutes.</p>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; border-radius: 6px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">If you did not request this verification string, please ignore this email safely.</p>
        </div>
      `;
}

