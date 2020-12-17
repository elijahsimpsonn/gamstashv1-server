const express = require('express')
const consolesRouter = express.Router()
const db = require("../db")

consolesRouter  
    .route('/')
    .get(async (req, res) => {
        try {
          const results = await db.query("SELECT * FROM consoles")
          res.status(200).json({
              status: "success",
              results: results.rows.length,
              data: {
                  consoles: results.rows
              }
          }) 
        } catch (err) {
            console.log(err)
        }
    })
    .post(async (req, res) => {
        try {
            const results = await db.query(
                "INSERT INTO consoles (name) VALUES ($1) RETURNING *",
                [req.body.name]
            )
            res.status(201).json({
                status: "success",
                data: {
                    console: results.rows[0]
                }
            })
        } catch(err) {
            console.log(err)
        }
    })

consolesRouter
    .route('/:id')
    .get(async (req, res) => {
        try {
            const results = await db.query("SELECT * FROM consoles WHERE id = $1", [req.params.id])
            res.status(200).json({
                status: "success",
                data: {
                  consoles: results.rows[0],
                },
              });
        } catch(err) {
            console.log(err)
        }
    })
    .patch(async (req, res) => {
        try {
            const results = await db.query(
                "UPDATE consoles SET name = $1 WHERE id = $2 RETURNING *",
                [req.body.name, req.params.id]
            )
            res.status(200).json({
                status: "success",
                data: {
                  consoles: results.rows[0],
                },
              });
        }catch (err) {
            console.log(err)
        }
    })
    .delete(async (req, res) => {
        try {
            const results = await db.query("DELETE FROM consoles WHERE id = $1", [req.params.id])
            res.status(204).json({
                status: "success"
            })
        }catch(err){
            console.log(err)
        }
    })

module.exports = consolesRouter