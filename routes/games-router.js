const express = require("express");
const gamesRouter = express.Router();
const db = require("../db");

gamesRouter
    .route("/")
    .get(async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM games");
        res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
            games: results.rows,
        },
        });
    } catch (err) {
        console.log(err);
    }
    });

gamesRouter
    .route("/:id")
    .delete(async (req, res) => {
        try {
          await db.query("DELETE FROM games WHERE id = $1", [req.params.id])  
          res.status(204).json({
            status: "success",
          });
        } catch (err) {
          console.log(err);
        }
      });

module.exports = gamesRouter;
