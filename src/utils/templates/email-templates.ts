export function WelcomeEmail(displayName: string) {
  const appUrl = "http://app.localhost:3000";
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

export function bookingEmail(displayName: string, tenant: any, bookingDetails: any) {
  const appUrl = `http://${tenant.slug}.localhost:3000`;
  
  // Format dates cleanly if available
  const startDate = bookingDetails.rental_start || "N/A";
  const endDate = bookingDetails.rental_end || "N/A";
  const rentalDays = bookingDetails.rental_days || 1;
  const totalAmount = bookingDetails.total ? Number(bookingDetails.total).toLocaleString() : "0.00";
  const vatAmount = bookingDetails.vat ? Number(bookingDetails.vat).toLocaleString() : "0.00";
  const deliveryFee = bookingDetails.delivery_fee ? Number(bookingDetails.delivery_fee).toLocaleString() : "0.00";

  // Google Calendar link generation (format: YYYYMMDDTHHMMSSZ)
  const formatCalDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "";
    const cleanDate = dateStr.split("T")[0].replace(/-/g, "");
    const cleanTime = timeStr ? timeStr.replace(/:/g, "") + "00" : "090000";
    return `${cleanDate}T${cleanTime}`;
  };

  const calStart = formatCalDate(bookingDetails.rental_start, bookingDetails.rental_time);
  const calEnd = formatCalDate(bookingDetails.rental_end, bookingDetails.rental_time);
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Car+Rental+Reservation+at+${encodeURIComponent(tenant.name)}&dates=${calStart}/${calEnd}&details=Your+booking+reference+is+confirmed.+Pickup+location:+${encodeURIComponent(bookingDetails.pickup_location || 'N/A')}`;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px 20px; max-width: 560px; margin: 0 auto; background-color: #f8fafc; color: #334155;">
      
      <!-- Container Card -->
      <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <!-- Success Header Image / Icon -->
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://img.icons8.com/color/96/checked-checkbox.png" alt="Success" width="64" style="display: block; margin: 0 auto 12px auto;" />
          <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0;">Booking Confirmed!</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Hi ${displayName || 'Valued Customer'}, thank you for choosing ${tenant.name}.</p>
        </div>

        <p style="color: #334155; font-size: 15px; line-height: 22px;">
          We are thrilled to have you on board. Your reservation has been successfully processed and payment verified via <strong>${bookingDetails.payment_method || 'Online Payment'}</strong>.
        </p>

        <!-- Digital Receipt Box -->
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0f172a; font-size: 15px; font-weight: 600; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            Digital Receipt & Details
          </h3>
          
          <table style="width: 100%; font-size: 14px; color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Renter Name:</td>
              <td style="padding: 6px 0; font-weight: 500; text-align: right; color: #0f172a;">${bookingDetails.renter_name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Pickup Location:</td>
              <td style="padding: 6px 0; font-weight: 500; text-align: right; color: #0f172a;">${bookingDetails.pickup_location || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Rental Period:</td>
              <td style="padding: 6px 0; font-weight: 500; text-align: right; color: #0f172a;">${startDate} to ${endDate} (${rentalDays} Days)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Time & Ref:</td>
              <td style="padding: 6px 0; font-weight: 500; text-align: right; color: #0f172a;">${bookingDetails.rental_time || 'N/A'} | Ref: ${bookingDetails.payment_ref || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Delivery Fee:</td>
              <td style="padding: 6px 0; font-weight: 500; text-align: right; color: #0f172a;">KES ${deliveryFee}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">VAT / Tax:</td>
              <td style="padding: 6px 0; font-weight: 500; text-align: right; color: #0f172a;">KES ${vatAmount}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 10px 0 0 0; font-weight: 600; color: #0f172a; font-size: 15px;">Total Paid:</td>
              <td style="padding: 10px 0 0 0; font-weight: 700; text-align: right; color: #0284c7; font-size: 16px;">KES ${totalAmount}</td>
            </tr>
          </table>
        </div>

        <!-- Call to Action Buttons -->
        <div style="text-align: center; margin: 28px 0 16px 0;">
          <a href="${appUrl}/bookings" style="background-color: #0284c7; color: #ffffff; padding: 12px 20px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 14px; margin-right: 8px; margin-bottom: 8px;">
            View Booking Dashboard
          </a>
          <a href="${googleCalendarUrl}" target="_blank" style="background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 14px; margin-bottom: 8px;">
            📅 Add to Calendar
          </a>
        </div>

        <!-- Support footer text -->
        <p style="color: #64748b; font-size: 12px; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px; line-height: 18px;">
          If you have any questions or require vehicle delivery adjustments, log into your account to create a support ticket and our team will assist you immediately.
        </p>
        
        <p style="color: #94a3b8; font-size: 11px; margin-top: 12px; text-align: center;">
          This is an automated confirmation email from ${tenant.name}. Please do not reply directly to this message.
        </p>
      </div>
      
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

export function VerifyEmailNotification(
  otp: string,
  otpValidityMinutes: number,
) {
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
