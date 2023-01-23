import { ApplicationError } from "@/protocols";

export function conflictError(): ApplicationError {
  return {
    name: "ConflictError",
    message: "There was a conflict related to your request",
  };
}
