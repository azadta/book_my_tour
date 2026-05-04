import path from "path";
import { json } from "stream/consumers";
import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

class AppLogger {
  private logger: winston.Logger;
  constructor() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const format = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} ${info.level} ${info.message} ${info.meta ? JSON.stringify(info.meta) : ""}`,
      ),
    );

    const transports = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(process.cwd(), "logs", "error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join(process.cwd(), "logs", "all.log"),
      }),
    ];

    this.logger = winston.createLogger({
      level: isDevelopment ? "debug" : "warn",
      levels,
      format,
      transports,
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, { meta });
  }
  error(message: string, meta?: any) {
    this.logger.error(message, { meta });
  }
  warn(message: string, meta?: any) {
    this.logger.warn(message, { meta });
  }
  http(message: string) {
    this.logger.http(message);
  }
  debug(message: string, meta?: any) {
    this.logger.debug(message, { meta });
  }
}

export const logger = new AppLogger();
