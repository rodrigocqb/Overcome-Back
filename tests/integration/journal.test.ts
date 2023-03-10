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

describe("PUT /journals/:journalId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/journals/1").send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .put("/journals/1")
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
      .put("/journals/1")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when param is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .put("/journals/a")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when journal does not exist - invalid partition", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .put("/journals/0")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .put("/journals/1")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when params and body are valid", () => {
      it("should respond with status 404 when journal does not exist - valid partition", async () => {
        const token = await generateValidToken();
        const validBody = createValidjournalBody();

        const response = await server
          .put("/journals/1")
          .set("Authorization", `Bearer ${token}`)
          .send(validBody);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 when user does not own given journal", async () => {
        const token = await generateValidToken();
        const body = createValidjournalBody();
        const journal = await createJournal();

        const response = await server
          .put(`/journals/${journal.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      describe("when journal exists and is owned by the user", () => {
        it("should respond with status 200 and journal data", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = createValidjournalBody();
          const journal = await createJournal(user);

          const response = await server
            .put(`/journals/${journal.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          expect(response.status).toBe(httpStatus.OK);
          expect(response.body).toEqual(
            expect.objectContaining({
              id: journal.id,
              text: body.text,
              userId: user.id,
              createdAt: journal.createdAt.toISOString(),
            }),
          );
        });

        it("should update journal on database", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const body = createValidjournalBody();
          const journal = await createJournal(user);

          const response = await server
            .put(`/journals/${journal.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);

          expect(response.body.text).toBe(body.text);
          expect(response.body.text).not.toBe(journal.text);
        });
      });
    });
  });
});

describe("DELETE /journals/:journalId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.delete("/journals");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server
      .delete("/journals")
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
      .delete("/journals")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when given token is valid", () => {
    it("should respond with status 400 when param is not valid", async () => {
      const token = await generateValidToken();

      const response = await server
        .delete("/journals/a")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when journal does not exist - invalid partition", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .delete("/journals/0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when id param is valid", () => {
      it("should respond with status 404 when journal does not exist - valid partition", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server
          .delete("/journals/1")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 when user does not own given journal", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const journal = await createJournal();

        const response = await server
          .delete(`/journals/${journal.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      describe("when journal exists and is owned by the user", () => {
        it("should respond with status 204", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const journal = await createJournal(user);

          const response = await server
            .delete(`/journals/${journal.id}`)
            .set("Authorization", `Bearer ${token}`);

          expect(response.status).toBe(httpStatus.NO_CONTENT);
        });

        it("should delete journal", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const journal = await createJournal(user);

          const beforeCount = await prisma.journal.count();

          await server
            .delete(`/journals/${journal.id}`)
            .set("Authorization", `Bearer ${token}`);

          const afterCount = await prisma.journal.count();

          expect(beforeCount).toBe(1);
          expect(afterCount).toBe(0);
        });
      });
    });
  });
});
