import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactFormData } from '../../dto/contact.types';
import { RgpdRequestData } from '../../dto/rgpd.types';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail(to: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: 'Test Email - EcoRide',
        html: `
          <h2>Configuration email réussie !</h2>
          <p>Si vous recevez ce message, votre configuration SMTP fonctionne correctement.</p>
          <p><strong>Serveur SMTP :</strong> ${process.env.SMTP_HOST}</p>
          <p><strong>Port :</strong> ${process.env.SMTP_PORT}</p>
          <p>L'équipe EcoRide</p>
        `,
      });
      console.log('Email de test envoyé avec succès');
    } catch (error) {
      console.error('Erreur envoi email de test:', error);
      throw error;
    }
  }

  //Email de contact
  async sendContactMessage(contactData: ContactFormData): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: process.env.ADMIN_EMAIL, // aecoride@gmail.com
        from: `"EcoRide Contact" <${process.env.SMTP_USER}>`,
        subject: `[Contact EcoRide] ${contactData.subject}`,
        html: `
          <h3>Nouveau message de contact EcoRide</h3>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Nom :</strong> ${contactData.name}</p>
            <p><strong>Email :</strong> ${contactData.email}</p>
            <p><strong>Sujet :</strong> ${contactData.subject}</p>
          </div>
          <div style="margin-top: 20px;">
            <h4>Message :</h4>
            <p style="background: white; padding: 15px; border-left: 4px solid #4CAF50;">
              ${contactData.message.replace(/\n/g, '<br>')}
            </p>
          </div>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Reçu le ${new Date().toLocaleString('fr-FR')}<br>
            Depuis le site EcoRide
          </p>
        `,
        // L'utilisateur peut répondre directement à son email.
        replyTo: contactData.email,
      });
      console.log('Message de contact envoyé avec succès');
    } catch (error) {
      console.error('Erreur envoi message de contact:', error);
      throw error;
    }
  }
  //Email demande RGPD
  async sendRgpdRequest(requestData: RgpdRequestData): Promise<void> {
    const typeLabels = {
      access: 'Accès aux données personnelles',
      rectification: 'Rectification des données',
      erasure: "Suppression des données (droit à l'oubli)",
      portability: 'Portabilité des données',
      opposition: 'Opposition au traitement',
    };

    try {
      await this.mailerService.sendMail({
        to: process.env.ADMIN_EMAIL,
        from: `"EcoRide RGPD" <${process.env.SMTP_USER}>`,
        subject: `[RGPD] Demande ${requestData.requestType.toUpperCase()}`,
        html: `
          <h3>Nouvelle demande RGPD - EcoRide</h3>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p><strong>Email du demandeur :</strong> ${requestData.email}</p>
            <p><strong>Type de demande :</strong> ${typeLabels[requestData.requestType]}</p>
            ${
              requestData.description
                ? `
              <div style="margin-top: 15px;">
                <h4>Description :</h4>
                <p style="background: white; padding: 10px; border-radius: 4px;">
                  ${requestData.description}
                </p>
              </div>
            `
                : ''
            }
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-radius: 4px;">
            <h4>Délai légal de réponse : 1 mois</h4>
            <p>Cette demande doit être traitée avant le <strong>${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</strong></p>
          </div>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Reçu le ${new Date().toLocaleString('fr-FR')}<br>
            Demande RGPD EcoRide
          </p>
        `,
        replyTo: requestData.email,
      });
      console.log('Demande RGPD envoyée avec succès');
    } catch (error) {
      console.error('Erreur envoi demande RGPD:', error);
      throw error;
    }
  }
}
