import { injectable } from "inversify";
import { IMailService } from "../interfaces/IMailService";
import sendEmailUtil from "../utils/sendEmail";
@injectable()
export class MailService implements IMailService {
  async sendEmail(to: string, subject: string, message: string) {
    await sendEmailUtil({ to, subject, message });
  }
}
