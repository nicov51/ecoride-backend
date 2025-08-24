import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { EmailService } from '../../modules/email/email.service';
import { ContactDto } from '../../dto/contact.dto';
import { ContactResponse } from '../../dto/contact.types';

@Controller('contact')
export class ContactController {
  constructor(private readonly emailService: EmailService) {}
  @Post()
  async sendContact(
    @Body(ValidationPipe) contactData: ContactDto,
  ): Promise<ContactResponse> {
    try {
      await this.emailService.sendContactMessage(contactData);
      return {
        success: true,
        message: 'Message envoyé avec succès',
      };
    } catch (error) {
      console.error('Erreur envoi message de contact:', error);
      return {
        success: false,
        message: 'Erreur envoi message de contact:',
      };
    }
  }
}
