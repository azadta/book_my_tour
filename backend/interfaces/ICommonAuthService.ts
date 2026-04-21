export interface ICommonAuthService {
  refreshToken(token: string): Promise<{
    newAccessToken: string;
  }>;
}
