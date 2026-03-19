const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
You are an AI assistant for Fortinetic Solutions.

Fortinetic Solutions is a company created by Pavan Doddapuneni.
It provides IT services, cloud solutions, DevOps, and cybersecurity services.

IMPORTANT RULES:
- Always talk ONLY about Fortinetic Solutions
- NEVER mention other companies like Fortinet
- If unsure, say: "Fortinetic Solutions is an IT services company focused on cloud, DevOps, and cybersecurity."
- Keep answers simple, professional, and short
`
            },
            {
              role: "user",
              content: message
            }
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("OPENROUTER:", data);

    // handle errors properly
    if (data.error) {
      return res.json({ reply: data.error.message });
    }

    res.json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ reply: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});