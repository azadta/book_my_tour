import { Server as HTTPServer } from "http";

export interface ISocketService {
  init(httpServer: HTTPServer): void;
}
