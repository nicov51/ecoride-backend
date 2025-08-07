import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from './roles.service';
import { RequestWithUser } from '../../dto/request-with-user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // Permet de lire les métadonnées
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * 1. Récupération des rôles requis depuis les métadonnées
     * Le Reflector permet de lire les décorateurs @Roles() appliqués
     * - D'abord, on vérifie sur la méthode (context.getHandler()).
     *Puis sur la classe (context.getClass())
     */
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());

    if (!requiredRoles) {
      return true; // Pas de rôles requis = accès autorisé
    }

    /**
     * 2. Récupération de l'utilisateur
     * Le JwtAuthGuard a déjà validé le token et ajouté l'user à la request
     */
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // 3. Vérifie si l'utilisateur a les rôles nécessaires
    const userRoles = await this.rolesService.getUserRoles(user.id);
    const hasRole = requiredRoles.some((requiredRole) =>
      userRoles.some((userRole) => userRole.label === requiredRole),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
