import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
// SetMetadata est une fonction de NestJS qui permet d'attacher des métadonnées
// à un handler (méthode de controller) on peut ainsi utilser @Role()
