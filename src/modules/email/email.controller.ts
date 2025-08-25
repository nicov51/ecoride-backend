import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('test')
  async sendTestEmail(@Body() body: { to: string }) {
    try {
      await this.emailService.sendTestEmail(body.to);
      return { message: 'Email de test envoyé avec succès!' };
    } catch (error) {
      throw error;
    }
  }
}
