const { KnexTimeoutError } = require("knex")

const ConsolesService = {
    getAllConsoles(knex) {
        return knex.select('*').from('consoles')
    },
    createConsole (knex, newConsole) {
        return knex
        .insert(newConsole)
        .into('consoles')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    getById (knex, id) {
        return knex.select('*').from('consoles').where('id', id).first()
    },
    deleteGamesInConsole (knex, id) {
        return knex.from('games').where("console_id", id).delete()
    },
    deleteConsole (knex, id) {
        return knex.from('consoles').where({id}).delete()
    },
    addGameToConsole (knex, newGame) {
        return knex
        .insert(newGame)
        .into('games')
        .returning('*')
        .then(rows => {
            return rows[0] 
        })
    }
}

module.exports = ConsolesService