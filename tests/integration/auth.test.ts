import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { conflictError } from "@/errors";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser, generateValidUserBody } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await cleanDb();
  await close();
});

const server = supertest(app);

describe("POST /users/sign-up", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/users/sign-up");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/users/sign-up").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should respond with status 409 when there is an user with given email", async () => {
      const body = generateValidUserBody();
      await createUser(body);

      const response = await server.post("/users/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body.message).toEqual(conflictError().message);
    });

    it("should respond with status 201 and create user when given email is unique", async () => {
      const body = generateValidUserBody();

      const response = await server.post("/users/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({});
    });

    it("should save user on database", async () => {
      const body = generateValidUserBody();

      await server.post("/users/sign-up").send(body);

      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          email: body.email,
          name: body.name,
        }),
      );
    });
  });
});
