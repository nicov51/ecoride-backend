import { Controller, Body, Post } from '@nestjs/common';
import { EmailService } from '../../modules/email/email.service';
import { RgpdRequestDto } from '../../dto/rgpd.dto';

@Controller('rgpd')
export class RgpdController {
  constructor(private readonly emailService: EmailService) {}

  @Post('request')
  async submitRequest(@Body() requestData: RgpdRequestDto) {
    try {
      await this.emailService.sendRgpdRequest(requestData);
      return {
        success: true,
        message: 'Demande RGPD enregistrée avec succès',
      };
    } catch (error) {
      console.error('Erreur RGPD:', error);
      return {
        success: false,
        message: "Erreur lors de l'enregistrement de la demande",
      };
    }
  }
}
