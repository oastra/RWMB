const OpenAI = require("openai");
require("dotenv").config();

console.log("Loaded API Key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const retryDelay = 60000; // 1 minute

async function test(retries = 3) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful assistant." }],
    });
    console.log(completion.choices[0].message.content);
  } catch (error) {
    if (error.code === "insufficient_quota" && retries > 0) {
      console.log(
        `Quota exceeded. Retrying in ${retryDelay / 1000} seconds...`
      );
      setTimeout(() => test(retries - 1), retryDelay);
    } else {
      console.error("Error:", error);
    }
  }
}

test();
