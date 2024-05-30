import fetch from "node-fetch";

const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

export default async (req, res) => {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const response = await fetch(
        `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `apikey ${mailchimpApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
          }),
        }
      );

      const data = await response.json();

      if (response.status >= 400) {
        return res.status(400).json({ success: false, message: data.detail });
      }

      res
        .status(200)
        .json({ success: true, message: "Subscription successful" });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
