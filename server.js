const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // simple working reply (NO AI for now)
    return res.json({
      reply: "You said: " + message,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));