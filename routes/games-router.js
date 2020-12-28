const express = require("express");
const gamesRouter = express.Router();
const db = require("../db/config");

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
    .get(async (req, res) => {
        try {
          const games = await db.query("SELECT * FROM games WHERE id = $1", [
            req.params.id,
          ]);
          res.status(200).json({
            status: "success",
            data: {
              games: games.rows[0]
            },
          });
        } catch (err) {
          console.log(err);
        }
      })
      .patch(async (req, res) => {
        try {
          const results = await db.query(
            "UPDATE games SET title = $1, condition = $2 WHERE id = $3 RETURNING *",
            [req.body.title, req.body.condition, req.params.id]
          );
          res.status(200).json({
            status: "success",
            data: {
              consoles: results.rows[0],
            },
          });
        } catch (err) {
          console.log(err);
        }
      })  
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
