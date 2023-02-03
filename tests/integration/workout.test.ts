import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import { createSheet, createUser, createWorkout } from "../factories";
import { Cardio } from "@prisma/client";

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

describe("GET /workouts", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/workouts");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/workouts")
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
      .get("/workouts")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 200 and an empty array if user has no workouts completed yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .get("/workouts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and an array of workouts including sheets or cardio", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const sheet = await createSheet(user);
      const sheetWorkout = await createWorkout({
        userId: user.id,
        sheetId: sheet.id,
      });
      const cardioWorkout = await createWorkout({
        userId: user.id,
        cardio: Cardio.CYCLING,
      });

      const response = await server
        .get("/workouts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: cardioWorkout.id,
          userId: user.id,
          sheetId: null,
          createdAt: cardioWorkout.createdAt.toISOString(),
          updatedAt: cardioWorkout.updatedAt.toISOString(),
          cardio: Cardio.CYCLING,
          Sheet: null,
        },
        {
          id: sheetWorkout.id,
          userId: user.id,
          sheetId: sheet.id,
          createdAt: sheetWorkout.createdAt.toISOString(),
          updatedAt: sheetWorkout.updatedAt.toISOString(),
          cardio: null,
          Sheet: {
            id: sheet.id,
            title: sheet.title,
            userId: user.id,
            createdAt: sheet.createdAt.toISOString(),
            updatedAt: sheet.updatedAt.toISOString(),
          },
        },
      ]);
    });
  });
});

describe("POST /workouts", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/workouts").send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .post("/workouts")
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
      .post("/workouts")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .post("/workouts")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body includes both sheetId and cardio", async () => {
      const token = await generateValidToken();
      const invalidBody = { sheetId: 1, cardio: Cardio.CYCLING };

      const response = await server
        .post("/workouts")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body includes neither sheetId nor cardio", async () => {
      const token = await generateValidToken();
      const invalidBody = {};

      const response = await server
        .post("/workouts")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when given sheet does not exist", async () => {
      const token = await generateValidToken();
      const validBody = { sheetId: 1 };

      const response = await server
        .post("/workouts")
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when user does not own given sheet", async () => {
      const token = await generateValidToken();
      const sheet = await createSheet();
      const validBody = { sheetId: sheet.id };

      const response = await server
        .post("/workouts")
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    describe("when user owns given sheet", () => {
      it("should respond with status 201 and workout data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const sheet = await createSheet(user);
        const validBody = { sheetId: sheet.id };

        const response = await server
          .post("/workouts")
          .set("Authorization", `Bearer ${token}`)
          .send(validBody);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            sheetId: sheet.id,
            cardio: null,
          }),
        );
      });

      it("should save workout on the database", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const sheet = await createSheet(user);
        const validBody = { sheetId: sheet.id };

        const beforeCount = await prisma.workout.count();

        await server
          .post("/workouts")
          .set("Authorization", `Bearer ${token}`)
          .send(validBody);

        const afterCount = await prisma.workout.count();

        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
    });

    describe("when user chooses cardio with a valid body", () => {
      it("should respond with status 201 and workout data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const validBody = { cardio: Cardio.CYCLING };

        const response = await server
          .post("/workouts")
          .set("Authorization", `Bearer ${token}`)
          .send(validBody);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            sheetId: null,
            cardio: Cardio.CYCLING,
          }),
        );
      });

      it("should save workout on the database", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const validBody = { cardio: Cardio.CYCLING };

        const beforeCount = await prisma.workout.count();

        await server
          .post("/workouts")
          .set("Authorization", `Bearer ${token}`)
          .send(validBody);

        const afterCount = await prisma.workout.count();

        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
    });
  });
});
