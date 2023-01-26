import { faker } from "@faker-js/faker";

export function createValidSheetBody() {
  return {
    title: faker.lorem.word(),
  };
}
