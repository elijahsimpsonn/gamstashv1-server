const knex = require("knex");
const supertest = require("supertest");
const app = require("../app");
const { makeGamesArray } = require("./games.fixtures");
const { makeConsolesArray } = require("./consoles.fixtures");

describe("Games Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from the db", () => db.destroy());
  before("clean the table", () =>
    db.raw("TRUNCATE consoles, games RESTART IDENTITY CASCADE")
  );
  afterEach("cleanup", () =>
    db.raw("TRUNCATE consoles, games RESTART IDENTITY CASCADE")
  );

  describe(`GET /games`, () => {
    context(`Given there are games in the database`, () => {
      const testGames = makeGamesArray();
      const testConsoles = makeConsolesArray();

      beforeEach(`insert test games`, () => {
        return db
          .into("consoles")
          .insert(testConsoles)
          .then(() => {
            return db.into("games").insert(testGames);
          });
      });

      it("Responds with 200 and all of the games", () => {
        return supertest(app).get("/api/v1/games").expect(200, testGames);
      });
    });
  });

  describe(`DELETE /games/:id`, () => {
    context(`Given there is a game in the database at this ID`, () => {
      const testGames = makeGamesArray();
      const testConsoles = makeConsolesArray();

      beforeEach(`insert test games`, () => {
        return db
          .into("consoles")
          .insert(testConsoles)
          .then(() => {
            return db.into("games").insert(testGames);
          });
      });

      it("responds with 204 and removes the game from the database", () => {
        const idToRemove = "2";
        const expectedGames = testGames.filter(
          (game) => game.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/v1/games/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get("/api/v1/games").expect(expectedGames)
          );
      });
    });
  });

  describe(`PATCH /games/:id`, () => {
    context(`Given there is a game at this ID in the database`, () => {
      const testGames = makeGamesArray();
      const testConsoles = makeConsolesArray();

      beforeEach(`insert test games`, () => {
        return db
          .into("consoles")
          .insert(testConsoles)
          .then(() => {
            return db.into("games").insert(testGames);
          });
      });

      it(`responds with 204 and updates the game`, () => {
        const idToUpdate = 2;
        const updateGame = {
          title: "Random Game",
          condition: "Random Condition",
        };
        const expectedGame = {
          ...testGames[idToUpdate - 1],
          ...updateGame,
        };
        return supertest(app)
          .patch(`/api/v1/games/${idToUpdate}`)
          .send(updateGame)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/v1/games/${idToUpdate}`)
              .expect(expectedGame)
          );
      });
    });
  });
});
