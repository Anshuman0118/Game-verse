const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3002;

let ratings = [];
let idCounter = 1;

// Welcome Route
app.get("/", (req, res) => {
    res.send("Welcome to the Ratings API!");
});

// Create a New Rating (POST)
app.post("/ratings", (req, res) => {
    try {
        const { user, game, score } = req.body;

        if (!user || !game || typeof score !== "number" || score < 1 || score > 5) {
            return res.status(400).json({ error: "User, game, and a score (1-5) are required." });
        }

        const newRating = { id: idCounter++, user, game, score };
        ratings.push(newRating);
        res.status(201).json(newRating);

    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Read All Ratings (GET)
app.get("/ratings", (req, res) => {
    try {
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Read a Specific Rating (GET by ID)
app.get("/ratings/:id", (req, res) => {
    try {
        const ratingId = Number(req.params.id);
        const rating = ratings.find(r => r.id === ratingId);

        if (!rating) {
            return res.status(404).json({ error: "Rating not found" });
        }

        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a Rating (PUT - Full Update)
app.put("/ratings/:id", (req, res) => {
    try {
        const ratingId = Number(req.params.id);
        const { user, game, score } = req.body;
        let rating = ratings.find(r => r.id === ratingId);

        if (!rating) {
            return res.status(404).json({ error: "Rating not found" });
        }

        if (!user || !game || typeof score !== "number" || score < 1 || score > 5) {
            return res.status(400).json({ error: "User, game, and a score (1-5) are required." });
        }

        rating.user = user;
        rating.game = game;
        rating.score = score;

        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Partially Update a Rating (PATCH)
app.patch("/ratings/:id", (req, res) => {
    try {
        const ratingId = Number(req.params.id);
        const { user, game, score } = req.body;
        let rating = ratings.find(r => r.id === ratingId);

        if (!rating) {
            return res.status(404).json({ error: "Rating not found" });
        }

        if (user) rating.user = user;
        if (game) rating.game = game;
        if (score !== undefined) {
            if (typeof score !== "number" || score < 1 || score > 5) {
                return res.status(400).json({ error: "Score must be a number between 1 and 5." });
            }
            rating.score = score;
        }

        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a Rating (DELETE)
app.delete("/ratings/:id", (req, res) => {
    try {
        const ratingId = Number(req.params.id);
        const index = ratings.findIndex(r => r.id === ratingId);

        if (index === -1) {
            return res.status(404).json({ error: "Rating not found" });
        }

        ratings.splice(index, 1);
        res.status(204).send();

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
