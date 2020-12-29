const GamesService = {
  getAllGames(knex) {
    return knex.select("*").from("games");
  },
  getById(knex, id) {
    return knex.select("*").from("games").where("id", id).first();
  },
  updateGame(knex, id, newGameFields) {
    return knex.from("games").where({ id }).update(newGameFields);
  },
  deleteGame(knex, id) {
    return knex.from("games").where({ id }).delete();
  },
};

module.exports = GamesService;
