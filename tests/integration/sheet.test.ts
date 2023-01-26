import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import {
  createExercise,
  createUser,
  createValidExerciseBody,
  createValidSheetBody,
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
            title: body.title
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
