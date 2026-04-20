export interface ISecurityPayload {
  id: string;
  role: string;
}

export interface ISecurityService {
  generateAccessToken(payload: ISecurityPayload): string;
  verifyAccessToken(token: string): ISecurityPayload;
  generateRefreshToken(payload: ISecurityPayload): string;
  verifyRefreshToken(token: string): ISecurityPayload;
}
