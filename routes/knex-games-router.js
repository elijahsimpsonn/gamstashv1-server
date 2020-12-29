const path = require("path");
const express = require("express");
const GamesService = require("../services/games-service");
const gamesRouter = express.Router();
const jsonParser = express.json();


gamesRouter 
    .route("/")
    .get((req, res, next) => {
        GamesService.getAllGames(req.app.get('db'))
        .then(games => {
            return res.json(games)
        })
        .catch (next)
    })

gamesRouter
    .route("/:id")
    .get((req, res, next) => {
        GamesService.getById(req.app.get('db'), req.params.id)
        .then((game) => {
            return res.json(game)
        })
    })
    .patch(jsonParser, (req, res, next) => {
        let title = req.body.title 
        let condition = req.body.condition 
        const newGameFields = { title, condition }
        GamesService.updateGame(req.app.get('db'), req.params.id, newGameFields)
        .then(() => {
            return res.status(204).end()
        })
    })
    .delete((req, res, next) => {
        GamesService.deleteGame(req.app.get('db'), req.params.id)
        .then(() => {
            return res.status(204).end()
        })
    })

    module.exports = gamesRouter