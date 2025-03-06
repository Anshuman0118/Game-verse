const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;


app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/leaderboard")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


const playerSchema = new mongoose.Schema({
    userid: { type: String, unique: true },  
    name: String,
    score: Number
});

const Player = mongoose.model("Player", playerSchema);


app.post("/players", async (req, res) => {
    try {
        const { userid, name, score } = req.body;
        const newPlayer = new Player({ userid, name, score });
        await newPlayer.save();
        res.status(201).json(newPlayer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/players", async (req, res) => {
    try {
        const players = await Player.find().sort({ score: -1 }); 
        res.json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/players/:id", async (req, res) => {
  try {
      const player = await Player.findOne({ userid: req.params.id }); 
      if (!player) {
          return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


app.put("/players/:userid", async (req, res) => {
    try {
        const { score } = req.body;
        const updatedPlayer = await Player.findOneAndUpdate({userid:req.params.userid}, { score }, { new: true });
        res.json(updatedPlayer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete("/players/:id", async (req, res) => {
    try {
        await Player.findOneAndDelete({userid:req.params.id});
        res.json({ message: "Player removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
