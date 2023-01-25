import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { createObjective, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

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

describe("GET /objectives", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/objectives");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/objectives")
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
      .get("/objectives")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 404 when user has no objective saved yet", async () => {
      const token = await generateValidToken();

      const response = await server
        .get("/objectives")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and objective if user has an objective saved", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const objective = await createObjective(user);

      const response = await server
        .get("/objectives")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: objective.id,
        userId: objective.userId,
        title: objective.title,
        currentWeight: objective.currentWeight,
        goalWeight: objective.goalWeight,
        createdAt: objective.createdAt.toISOString(),
        updatedAt: objective.updatedAt.toISOString(),
      });
    });
  });
});
