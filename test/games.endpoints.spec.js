const { expect } = require("chai");
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
    context(`Given no games`, () => {
      it(`Responds with 200 and an empty list`, () => {
        return supertest(app).get(`/api/v1/games`).expect(200, []);
      });
    });

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
    context(`There is no game to delete at this ID`, () => {
      it(`responds with 404`, () => {
        const id = 123456;
        return supertest(app)
          .delete(`/games/${id}`)
          .expect(404);
      });
    });

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
        const idToRemove = 2;
        const expectedGames = testGames.filter(
          (game) => game.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/v1/games/${idToRemove}`)
          .expect(204)
          .then((res) => supertest(app).get("/api/v1/games").expect(expectedGames));
      });
    });
  });

  describe(`PATCH /games/:id`, () => {
    context(`There is no game to update at this ID`, () => {
      it(`responds with 400`, () => {
        const id = 123456;
        return supertest(app)
          .delete(`/api/v1/games/${id}`)
          .expect(400);
      });
    });

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
            supertest(app).get(`/api/v1/games/${idToUpdate}`).expect(expectedGame)
          );
      });

      it(`reponds with 400 when no required fields are supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/games/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain either 'title', 'console_id', or 'condition'`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateGame = {
          title: "updated game title",
        };
        const expectedGame = {
          ...testGames[idToUpdate - 1],
          ...updateGame,
        };

        return supertest(app)
          .patch(`/games/${idToUpdate}`)
          .send({
            ...updateGame,
            fieldToIgnore: "should not be in the GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app).get(`/games/${idToUpdate}`).expect(expectedGame)
          );
      });
    });
  });
});
