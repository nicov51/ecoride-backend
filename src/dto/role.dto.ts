import { Role } from '../models/role.entity';

export class RoleDto {
  id: number;
  label: string;

  constructor(role: Role) {
    this.id = role.id;
    this.label = role.label;
  }
}
