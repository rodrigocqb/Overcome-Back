import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

export function loadEnv() {
  const path =
    process.env.NODE_ENV === "test"
      ? ".env.test"
      : process.env.NODE_ENV === "development"
        ? ".env.development"
        : process.env.NODE_ENV === "production"
          ? ".env.production"
          : ".env";

  const currentEnvs = dotenv.config({ path, override: true });
  dotenvExpand.expand(currentEnvs);
}
