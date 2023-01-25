import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import { createExercise, createUser } from "../factories";

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

describe("GET /exercises", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/exercises");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/exercises")
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
      .get("/exercises")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 200 and an empty array if there are no exercises", async () => {
      const token = await generateValidToken();

      const response = await server
        .get("/exercises")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and exercise list if there are exercises on the database", async () => {
      const token = await generateValidToken();
      const exercise = await createExercise();

      const response = await server
        .get("/exercises")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: exercise.id,
          name: exercise.name,
          createdAt: exercise.createdAt.toISOString(),
          updatedAt: exercise.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

describe("GET /exercises/:searchParam", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/exercises/squat");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/exercises/squat")
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
      .get("/exercises/squat")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 404 if there are no matching exercises", async () => {
      const token = await generateValidToken();

      const response = await server
        .get("/exercises/squat")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and exercise list if there are matching exercises", async () => {
      const token = await generateValidToken();
      const exercise = await createExercise("squat");

      const response = await server
        .get("/exercises/qUa")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: exercise.id,
          name: exercise.name,
          createdAt: exercise.createdAt.toISOString(),
          updatedAt: exercise.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

