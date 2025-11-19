const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---- Connect to Database ----
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pollsDB";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log("Failed to connect. Using memory store."));

let useMemory = mongoose.connection.readyState !== 1;
let memoryDB = [];
let idCounter = 1;

// ---- Schema ----
const pollSchema = new mongoose.Schema({
  question: String,
  options: [{ text: String, votes: { type: Number, default: 0 } }],
  createdAt: { type: Date, default: Date.now },
});
const Poll = mongoose.model("Poll", pollSchema);

// ---- ROUTES ----

// GET all polls
app.get("/api/polls", async (req, res) => {
  if (useMemory) {
    return res.json(
      memoryDB.map((p) => ({
        id: p.id,
        question: p.question,
        createdAt: p.createdAt,
      }))
    );
  }

  const polls = await Poll.find({}, "question createdAt");
  res.json(
    polls.map((p) => ({
      id: p._id,
      question: p.question,
      createdAt: p.createdAt,
    }))
  );
});

// CREATE poll
app.post("/api/polls", async (req, res) => {
  const { question, options } = req.body;

  if (!question || !options || options.length < 2)
    return res.status(400).json({ message: "Invalid poll data" });

  if (useMemory) {
    const poll = {
      id: idCounter++,
      question,
      options: options.map((o) => ({ text: o, votes: 0 })),
      createdAt: new Date(),
    };
    memoryDB.push(poll);
    return res.json(poll);
  }

  const poll = await Poll.create({
    question,
    options: options.map((o) => ({ text: o })),
  });
  res.json(poll);
});

// GET single poll
app.get("/api/polls/:id", async (req, res) => {
  const id = req.params.id;

  if (useMemory) {
    const poll = memoryDB.find((p) => p.id == id);
    return res.json(poll);
  }

  const poll = await Poll.findById(id);
  res.json(poll);
});

// VOTE
app.post("/api/polls/:id/vote", async (req, res) => {
  const { id } = req.params;
  const { optionIndex } = req.body;

  if (useMemory) {
    const poll = memoryDB.find((p) => p.id == id);
    poll.options[optionIndex].votes++;
    return res.json(poll);
  }

  const poll = await Poll.findById(id);
  poll.options[optionIndex].votes += 1;
  await poll.save();
  res.json(poll);
});

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
