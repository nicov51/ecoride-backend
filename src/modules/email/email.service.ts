import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  // Todo: on va plutot gerer ça en messagerie interne!
  // async sendRideValidationRequest(
  //   ride: Ride,
  //   participant: User,
  // ): Promise<void> {
  //   try {
  //     await this.mailerService.sendMail({
  //       to: participant.email,
  //       subject: `Validation requise - Trajet ${ride.departurePlace} → ${ride.arrivalPlace}`,
  //       html: `
  //         <h2>Bonjour ${participant.pseudo},</h2>
  //         <p>Votre trajet du ${ride.departureDateTime.toLocaleDateString(
  //           'fr-FR',
  //           {
  //             year: 'numeric',
  //             month: 'long',
  //             day: 'numeric',
  //             hour: '2-digit',
  //             minute: '2-digit',
  //           },
  //         )} est terminé !</p>
  //         <p><strong>Trajet :</strong> ${ride.departurePlace} → ${ride.arrivalPlace}</p>
  //         <p><strong>Conducteur :</strong> ${ride.driver.pseudo}</p>
  //         <p>Merci de vous rendre sur votre espace pour confirmer que tout s'est bien passé.</p>
  //         <a href="${process.env.FRONTEND_URL}/rides/${ride.id}/validate"
  //            style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
  //           Valider le trajet
  //         </a>
  //         <p>L'équipe EcoRide</p>
  //       `,
  //     });
  //   } catch (error) {
  //     console.error('Erreur envoi email:', error);
  //     // Ne pas faire planter l'app si l'email échoue
  //   }
  // }
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
  //Todo: Email de confirmation d'inscription
  // async sendRegistrationConfirmation(
  //   user: { email: string; pseudo: string },
  //   token: string,
  // ): Promise<void> {
  //   try {
  //     await this.mailerService.sendMail({
  //       to: user.email,
  //       subject: 'Confirmer votre inscription - EcoRide',
  //       html: `
  //         <h2>Bienvenue ${user.pseudo} !</h2>
  //         <p>Merci de vous être inscrit sur EcoRide.</p>
  //         <p>Pour activer votre compte, cliquez sur le lien ci-dessous :</p>
  //         <a href="${process.env.FRONTEND_URL}/confirm-email?token=${token}"
  //            style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
  //           Confirmer mon email
  //         </a>
  //         <p>Ce lien expire dans 24h.</p>
  //         <p>L'équipe EcoRide</p>
  //       `,
  //     });
  //   } catch (error) {
  //     console.error('Erreur envoi email confirmation:', error);
  //   }
  // }
  // async sendPasswordReset(
  //   user: { email: string; pseudo: string },
  //   token: string,
  // ): Promise<void> {
  //   try {
  //     await this.mailerService.sendMail({
  //       to: user.email,
  //       subject: 'Réinitialisation de mot de passe - EcoRide',
  //       html: `
  //         <h2>Bonjour ${user.pseudo},</h2>
  //         <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
  //         <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}"
  //            style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
  //           Changer mon mot de passe
  //         </a>
  //         <p>Ce lien expire dans 1h.</p>
  //         <p>Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.</p>
  //         <p>L'équipe EcoRide</p>
  //       `,
  //     });
  //   } catch (error) {
  //     console.error('❌ Erreur envoi email reset:', error);
  //   }
  // }
}
