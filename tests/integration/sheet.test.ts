import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import {
  createExercise,
  createSheet,
  createSheetExercise,
  createUser,
  createValidSheetBody,
  createValidSheetExerciseBody,
} from "../factories";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await cleanDb();
  await close();
});

const server = supertest(app);

describe("GET /sheets", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/sheets");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/sheets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET,
    );

    const response = await server
      .get("/sheets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 200 and an empty array if user has no sheets", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .get("/sheets")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and an array of sheets including only its exercises if user has at least one sheet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const sheet = await createSheet(user);
      const sheetExercise = await createSheetExercise(sheet);
      const otherSheet = await createSheet();
      await createSheetExercise(otherSheet);

      const response = await server
        .get("/sheets")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: sheet.id,
          title: sheet.title,
          userId: user.id,
          createdAt: sheet.createdAt.toISOString(),
          updatedAt: sheet.updatedAt.toISOString(),
          SheetExercise: [
            {
              weight: sheetExercise.weight,
              reps: sheetExercise.reps,
              sets: sheetExercise.sets,
              Exercise: {
                id: expect.any(Number),
                name: expect.any(String),
              },
            },
          ],
        },
      ]);
    });
  });
});

describe("POST /sheets", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/sheets").send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .post("/sheets")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET,
    );

    const response = await server
      .post("/sheets")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .post("/sheets")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should respond with status 201 and sheet data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = createValidSheetBody();

        const response = await server
          .post("/sheets")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: body.title,
          }),
        );
      });

      it("should save sheet on database", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = createValidSheetBody();

        const beforeCount = await prisma.sheet.count();

        await server
          .post("/sheets")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        const afterCount = await prisma.sheet.count();

        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
    });
  });
});

describe("PUT /sheets/:sheetId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/sheets/1").send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .put("/sheets/1")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET,
    );

    const response = await server
      .put("/sheets/1")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when param is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .put("/sheets/a")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when sheet does not exist - invalid partition", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const exercise = await createExercise();
      const body = createValidSheetExerciseBody(exercise);

      const response = await server
        .put("/sheets/0")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .put("/sheets/1")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when params and body are valid", () => {
      it("should respond with status 404 when sheet does not exist - valid partition", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const exercise = await createExercise();
        const body = createValidSheetExerciseBody(exercise);

        const response = await server
          .put("/sheets/1")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 when user does not own given sheet", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const exercise = await createExercise();
        const body = createValidSheetExerciseBody(exercise);
        const sheet = await createSheet();

        const response = await server
          .put(`/sheets/${sheet.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      describe("when sheet exists and is owned by the user", () => {
        it("should respond with status 200 and insert count", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const exercise = await createExercise();
          const body = createValidSheetExerciseBody(exercise);
          const sheet = await createSheet(user);

          const response = await server
            .put(`/sheets/${sheet.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          expect(response.status).toBe(httpStatus.OK);
          expect(response.body).toEqual({
            count: body.exerciseBody.length,
          });
        });

        it("should not save exercises that do not exist", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = createValidSheetExerciseBody();
          const sheet = await createSheet(user);

          const beforeCount = await prisma.sheetExercise.count();

          await server
            .put(`/sheets/${sheet.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          const afterCount = await prisma.sheetExercise.count();

          expect(beforeCount).toBe(0);
          expect(afterCount).toBe(0);
        });
      });
    });
  });
});

describe("DELETE /sheets/:sheetId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.delete("/sheets");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .delete("/sheets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign(
      { userId: userWithoutSession.id },
      process.env.JWT_SECRET,
    );

    const response = await server
      .delete("/sheets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when param is not valid", async () => {
      const token = await generateValidToken();

      const response = await server
        .delete("/sheets/a")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when sheet does not exist - invalid partition", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .delete("/sheets/0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when id param is valid", () => {
      it("should respond with status 404 when sheet does not exist - valid partition", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server
          .delete("/sheets/1")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 when user does not own given sheet", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const sheet = await createSheet();

        const response = await server
          .delete(`/sheets/${sheet.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      describe("when sheet exists and is owned by the user", () => {
        it("should respond with status 204", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const sheet = await createSheet(user);

          const response = await server
            .delete(`/sheets/${sheet.id}`)
            .set("Authorization", `Bearer ${token}`);

          expect(response.status).toBe(httpStatus.NO_CONTENT);
        });

        it("should delete sheet and its exercises", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const sheet = await createSheet(user);
          await createSheetExercise(sheet);

          const beforeCountSheet = await prisma.sheet.count();
          const beforeCountSheetExercise = await prisma.sheetExercise.count();

          await server
            .delete(`/sheets/${sheet.id}`)
            .set("Authorization", `Bearer ${token}`);

          const afterCountSheet = await prisma.sheet.count();
          const afterCountSheetExercise = await prisma.sheetExercise.count();

          expect(beforeCountSheet).toBe(1);
          expect(afterCountSheet).toBe(0);

          expect(beforeCountSheetExercise).toBe(1);
          expect(afterCountSheetExercise).toBe(0);
        });
      });
    });
  });
});
