const supertest = require("supertest");
const app = require("../app");
const { makeConsolesArray } = require("./consoles.fixtures");
const knex = require("knex");
const { expect } = require("chai");

describe("Consoles Endpoints", function () {
    let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from the db", () => db.destroy());
  beforeEach("clean the table", () =>
    db.raw("TRUNCATE consoles, games RESTART IDENTITY CASCADE")
  );
  afterEach("cleanup", () =>
    db.raw("TRUNCATE consoles, games RESTART IDENTITY CASCADE")
  );

  describe(`GET /consoles`, () => {
    context(`Given there are consoles in the database`, () => {
      const testConsoles = makeConsolesArray();

      beforeEach("insert consoles", () => {
        return db.into("consoles").insert(testConsoles);
      });

      it("Responds with 200 and all of the consoles", () => {
        return supertest(app).get("/api/v1/consoles").expect(200, testConsoles);
      });
    });
  });

  describe("POST /consoles", () => {
    context("When posting a console with all the required fields", () => {
      it("creates a console, responding with 201 and the new console", () => {

        const newConsole = {
          name: "Sega Genesis",
        };

        return supertest(app)
          .post("/api/v1/consoles")
          .send(newConsole)
          .expect(201)
          .expect((res) => {
            expect(res.body.name).to.eql(newConsole.name);
            expect(res.body).to.have.property("id");
          })
          .then((res) => {
            supertest(app)
              .get(`/api/v1/consoles/${res.body.id}`)
              .expect(res.body);
          });
      });
    });
  });

  describe("GET /consoles/:id", () => {
    context(`Given there are consoles in the database`, () => {
      const testConsoles = makeConsolesArray();

      beforeEach("insert consoles", () => {
        return db.into("consoles").insert(testConsoles);
      });

      it(`Responds with 200 and the specified article`, () => {
        const consoleId = 2;
        const expectedConsole = testConsoles[consoleId - 1];
        return supertest(app)
          .get(`/api/v1/consoles/${consoleId}`)
          .expect(200, expectedConsole);
      });
    });
  });

  describe(`DELETE /consoles/:id`, () => {
    context(`Given there is a console in the database at this ID`, () => {
      const testConsoles = makeConsolesArray();

      beforeEach(`insert test consoles`, () => {
        return db.into("consoles").insert(testConsoles);
      });

      it("responds with 204 and removes the console from the database", () => {
        const idToRemove = "2";
        const expectedConsoles = testConsoles.filter(
          (console) => console.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/v1/consoles/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get("/api/v1/consoles").expect(expectedConsoles)
          );
      });
    });
  });

  describe(`POST /consoles/:id/addGame`, () => {
    context("when posting a game with all the required fields", () => {
      const testConsoles = makeConsolesArray();

      beforeEach(`insert test consoles`, () => {
        return db.into("consoles").insert(testConsoles);
      });

      it("creates a game, responding with 201 and the new game", () => {
        const newGame = {
          title: "Test Game",
          condition: "Test Condition",
        };

        return supertest(app)
          .post("/api/v1/consoles/2/addGame")
          .send(newGame)
          .expect(201)
          .expect((res) => {
            expect(res.body.title).to.eql(newGame.title);
            expect(res.body.condition).to.eql(newGame.condition);
            expect(res.body.console_id).to.eql("2");
            expect(res.body).to.have.property("id");
          });
      });
    });
  });
});
