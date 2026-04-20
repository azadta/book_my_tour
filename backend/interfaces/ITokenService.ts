export interface IResetTokenResponse {
  resetToken: string;
  hashedToken: string;
  expireTime: number;
}

export interface ITokenService {
  getPasswordResetToken(): IResetTokenResponse;
}
