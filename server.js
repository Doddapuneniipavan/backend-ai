require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ CHAT ROUTE (IMPORTANT)
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `
You are a professional assistant.

Keep replies short, simple, and clear.
Max 2 lines.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      completion.choices[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.json({ reply: "Backend error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});