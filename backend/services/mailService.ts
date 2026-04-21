import { IMailService } from "../interfaces/IMailService.js";
import sendEmailUtil from "../utils/sendEmail.js";
export class MailService implements IMailService {
  async sendEmail(to: string, subject: string, message: string) {
    await sendEmailUtil({ to, subject, message });
  }
}
