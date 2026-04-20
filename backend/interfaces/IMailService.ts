export interface IMailService {
  sendEmail(to: string, subject: string, message: string): Promise<void>;
}
