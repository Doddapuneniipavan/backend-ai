const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "No message provided" });
    }

    const response = await groq.chat.completions.create({
      messages: [
        { role: "user", content: userMessage }
      ],
      model: "llama3-70b-8192",
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("REAL ERROR:", error);
    res.json({ reply: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});