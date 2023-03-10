import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import {
  createObjective,
  createUser,
  createValidObjectiveBody,
} from "../factories";
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
    it("should respond with status 404 when user does not yet have an objective", async () => {
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

describe("POST /objectives", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/objectives").send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .post("/objectives")
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
      .post("/objectives")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .post("/objectives")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should respond with status 403 when user already has an objective", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = createValidObjectiveBody();
        await createObjective(user);

        const response = await server
          .post("/objectives")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      describe("when user does not yet have an objective", () => {
        it("should respond with status 201 and objective data", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = createValidObjectiveBody();

          const response = await server
            .post("/objectives")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          expect(response.status).toBe(httpStatus.CREATED);
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              userId: user.id,
              title: body.title,
              currentWeight: body.currentWeight,
              goalWeight: body.goalWeight,
            }),
          );
        });

        it("should save objective on database", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = createValidObjectiveBody();

          const beforeCount = await prisma.objective.count();

          await server
            .post("/objectives")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          const afterCount = await prisma.objective.count();

          expect(beforeCount).toBe(0);
          expect(afterCount).toBe(1);
        });
      });
    });
  });
});

describe("PUT /objectives", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/objectives").send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .put("/objectives")
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
      .put("/objectives")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .put("/objectives")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should respond with status 404 when user does not yet have an objective", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = createValidObjectiveBody();

        const response = await server
          .put("/objectives")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      describe("when user already has an objective", () => {
        it("should respond with status 200 and objective data", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = createValidObjectiveBody();
          await createObjective(user);

          const response = await server
            .put("/objectives")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          expect(response.status).toBe(httpStatus.OK);
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              userId: user.id,
              title: body.title,
              currentWeight: body.currentWeight,
              goalWeight: body.goalWeight,
            }),
          );
        });

        it("should update objective on database", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = createValidObjectiveBody();
          const oldObjective = await createObjective(user);

          const response = await server
            .put("/objectives")
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          expect(response.body.id).toBe(oldObjective.id);
          expect(oldObjective.title).not.toBe(body.title);
        });
      });
    });
  });
});
