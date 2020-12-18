const express = require("express");
const consolesRouter = express.Router();
const db = require("../db");
// "SELECT * FROM consoles"
consolesRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const results = await db.query("SELECT * FROM consoles;");
      console.log("results", results)
      res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
          consoles: results.rows,
        },
      });
    } catch (err) {
      console.log(err);
    }
  })
  .post(async (req, res) => {
    try {
      const results = await db.query(
        "INSERT INTO consoles (name) VALUES ($1) RETURNING *",
        [req.body.name]
      );
      res.status(201).json({
        status: "success",
        data: {
          console: results.rows[0],
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

consolesRouter
  .route("/:id")
  .get(async (req, res) => {
    try {
      const consoles = await db.query("SELECT * FROM consoles WHERE id = $1", [
        req.params.id,
      ]);
      const games = await db.query(
        "SELECT * FROM games WHERE console_id = $1",
        [req.params.id]
      );
      res.status(200).json({
        status: "success",
        data: {
          consoles: consoles.rows[0],
          games: games.rows,
        },
      });
    } catch (err) {
      console.log(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const results = await db.query(
        "UPDATE consoles SET name = $1 WHERE id = $2 RETURNING *",
        [req.body.name, req.params.id]
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
      const results = await db.query("DELETE FROM consoles WHERE id = $1", [
        req.params.id,
      ]);
      res.status(204).json({
        status: "success",
      });
    } catch (err) {
      console.log(err);
    }
  });

consolesRouter.route("/:id/addGame").post(async (req, res) => {
  try {
    const newGame = await db.query(
      `INSERT INTO games (console_id, title, condition) VALUES ($1, $2, $3) RETURNING *;`,
      [req.params.id, req.body.title, req.body.condition]
    );
    res.status(201).json({
      status: "success",
      data: {
        game: newGame.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = consolesRouter;

// select * from console left join (select console_id, count(*)) as console_game_total from games group by console_id console on console.id = games.console_id;
