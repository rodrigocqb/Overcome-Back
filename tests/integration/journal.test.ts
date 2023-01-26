import app, { close, init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import {
  createJournal,
  createUser,
  createValidjournalBody,
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

describe("GET /journals", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/journals");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .get("/journals")
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
      .get("/journals")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 200 and an empty array if user has no journals written yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .get("/journals")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and an array of journals if user has already written at least one journal", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const journal = await createJournal(user);

      const response = await server
        .get("/journals")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: journal.id,
          userId: user.id,
          text: journal.text,
          createdAt: journal.createdAt.toISOString(),
          updatedAt: journal.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

describe("POST /journals", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/journals").send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .post("/journals")
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
      .post("/journals")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .post("/journals")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should respond with status 201 and journal data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = createValidjournalBody();

        const response = await server
          .post("/journals")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            text: body.text,
            userId: user.id,
          }),
        );
      });

      it("should save journal on database", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = createValidjournalBody();

        const beforeCount = await prisma.journal.count();

        await server
          .post("/journals")
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        const afterCount = await prisma.journal.count();

        expect(beforeCount).toBe(0);
        expect(afterCount).toBe(1);
      });
    });
  });
});
