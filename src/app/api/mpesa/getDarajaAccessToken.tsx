let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

export default async function getDarajaAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken;
  }

  const consumerKey = "hrbPWZT9zo6UcA6nejHkLyhMjVwbgiFjXUfTGMqzCTlajbuL";
  const consumerSecret = "qiPA9BRqK5BVLgkfSxk9hpXFyYqim4PGvFmuvVeMPwOYsB5BC6R9GKYWLNQGlUPP";

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok || !data.access_token) {
      throw new Error(data.errorMessage || "Failed to generate access token from Safaricom");
    }

    cachedToken = data.access_token;
    tokenExpiryTime = now + (Number(data.expires_in || 3600) - 300) * 1000;

    return cachedToken;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw error;
  }
}