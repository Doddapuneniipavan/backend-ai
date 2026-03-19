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
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GROQ RESPONSE:", data);

    const reply =
      data?.choices?.[0]?.message?.content || "No response from AI";

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ reply: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});