import { ApplicationError } from "@/protocols";

export function badRequestError(
  message: string | string[] = "Bad request!",
): ApplicationError {
  return {
    name: "BadRequestError",
    message,
  };
}
