export class CustomError extends Error {
  statusCode: number;
  errors: Record<string, string> | null;

  constructor(
    message: string,
    statusCode = 500,
    errors: Record<string, string> | null = null,
  ) {
    super(message);
    this.errors = errors;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
