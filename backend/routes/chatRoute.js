import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ⚡ Fast & affordable model
        messages: [
          { role: "system", content: "You are a helpful AI chatbot for a city issue reporting system." },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: data.error?.message || "OpenAI API error" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Chatbot server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
