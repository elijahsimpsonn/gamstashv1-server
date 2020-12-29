const express = require("express")
const path = require("path");
const consolesRouter = express.Router()
const ConsolesService = require("../services/consoles-service")
const jsonParser = express.json();

consolesRouter
    .route("/")
    .get((req, res, next) => {
        ConsolesService.getAllConsoles(req.app.get('db'))
        .then(consoles => {
            return res.json(consoles) 
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newConsole = { name }
        console.log(name)
        ConsolesService.createConsole(req.app.get('db'), newConsole)
        .then((console) => {
            res.status(201).json(console)
        })
        .catch(next)
    })

consolesRouter
    .route('/:id')
    .get((req, res, next) => {
        ConsolesService.getById(req.app.get('db'), req.params.id)
        .then((console) => {
            return res.json(console)
        })
    })
    .delete(async (req, res, next) => {
        try {
        await ConsolesService.deleteGamesInConsole(req.app.get('db'), req.params.id)
        await ConsolesService.deleteConsole(req.app.get('db'), req.params.id)
        .then(() => {
            res.status(204).end()
        }) }
        catch(next) {}
    })

consolesRouter
    .route('/:id/addGame')
    .post(jsonParser, (req, res, next) => {
        let console_id = req.params.id
        let title = req.body.title 
        let condition = req.body.condition
        const newGame = { console_id, title, condition }
        ConsolesService.addGameToConsole(req.app.get('db'), newGame)
        .then((game) => {
            res.status(201).json(game)
        })
    })

    module.exports = consolesRouter