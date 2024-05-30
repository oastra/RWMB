const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { model, messages, max_tokens } = req.body;
    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens,
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
