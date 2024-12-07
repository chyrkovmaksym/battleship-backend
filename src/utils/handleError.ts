import { CustomError } from "./customError";

export const handleError = (
  error: unknown
): { status: number; message: string } => {
  if (error instanceof CustomError) {
    return { status: error.statusCode, message: error.message };
  } else {
    console.error("Unknown error", error);
    return { status: 500, message: "An unexpected error occurred" };
  }
};
