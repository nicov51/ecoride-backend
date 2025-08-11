import { User } from '../models/user.entity';
import { RoleDto } from './role.dto';

export class UserResponseDto {
  id: number;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  pseudo: string;
  isVerified: boolean;
  picture: string | null;
  isSuspended: boolean;
  suspendedAt?: string | null;
  roles: RoleDto[];

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.firstName = user.firstName;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.birthDate = String(user.birthDate); // plus simple
    this.pseudo = user.pseudo;
    this.isVerified = user.isVerified;
    this.isSuspended = user.isSuspended;
    this.suspendedAt = user.suspendedAt?.toISOString();
    this.roles = user.roles?.map((role) => new RoleDto(role));

    // Simplification sans instanceof
    if (user.picture) {
      this.picture = Buffer.isBuffer(user.picture)
        ? user.picture.toString('base64')
        : String(user.picture); // fonctionne aussi si c’est une string
    } else {
      this.picture = null;
    }
  }
}
