import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { conflictError } from "@/errors";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createUser,
  generateValidLoginBody,
  generateValidOAuthBody,
  generateValidUserBody,
} from "../factories";
import { cleanDb } from "../helpers";

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

    it("should respond with status 201", async () => {
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

describe("POST /users/sign-in", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/users/sign-in");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/users/sign-in").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should respond with status 401 if there is no user for given email", async () => {
      const body = generateValidLoginBody();

      const response = await server.post("/users/sign-in").send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
      const body = generateValidLoginBody();
      await createUser(body);

      const response = await server.post("/users/sign-in").send({
        ...body,
        password: faker.lorem.word(),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should respond with status 200 and body should contain user data and token", async () => {
        const body = generateValidLoginBody();
        const user = await createUser(body);

        const response = await server.post("/users/sign-in").send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: user.id,
          name: user.name,
          token: expect.any(String),
        });
      });

      it("should save session on database", async () => {
        const body = generateValidLoginBody();
        await createUser(body);

        const beforeCount = await prisma.session.count();

        await server.post("/users/sign-in").send(body);

        const afterCount = await prisma.session.count();

        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
    });
  });
});

describe("POST /users/oauth", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/users/oauth");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/users/oauth").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    describe("when user is not yet registered on the database", () => {
      it("should respond with status 200 and body should contain user data and token", async () => {
        const body = generateValidOAuthBody();
  
        const response = await server.post("/users/oauth").send(body);
  
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: body.name,
          token: expect.any(String),
        });
      });

      it("should save user on database", async () => {
        const body = generateValidOAuthBody();
  
        const beforeCount = await prisma.user.count();

        await server.post("/users/oauth").send(body);

        const afterCount = await prisma.user.count();

        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
  
      it("should save session on database", async () => {
        const body = generateValidOAuthBody();
  
        const beforeCount = await prisma.session.count();
  
        await server.post("/users/oauth").send(body);
  
        const afterCount = await prisma.session.count();
  
        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
    });

    describe("when user is already registered on the database", () => {
      it("should respond with status 200 and body should contain user data and token", async () => {
        const body = generateValidOAuthBody();
        const user = await createUser(body);
  
        const response = await server.post("/users/oauth").send(body);
  
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: user.id,
          name: user.name,
          token: expect.any(String),
        });
      });
  
      it("should save session on database", async () => {
        const body = generateValidOAuthBody();
        await createUser(body);
  
        const beforeCount = await prisma.session.count();
  
        await server.post("/users/oauth").send(body);
  
        const afterCount = await prisma.session.count();
  
        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
    });
  });
});
