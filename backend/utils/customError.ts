export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    (Error as any).captureStackTrace(this, this.constructor);
  }
}
