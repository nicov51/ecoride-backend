import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../models/role.entity';
import { In, Repository } from 'typeorm';
import { User } from '../../models/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }
  async create(createRoleDto: { label: string }): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }
  async findByIds(ids: number[]): Promise<Role[]> {
    return this.roleRepository.findBy({ id: In(ids) });
  }
  private async validateUserAndRole(
    userId: number,
    roleLabel: string,
  ): Promise<{ user: User; role: Role }> {
    const [user, role] = await Promise.all([
      this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      }),
      this.roleRepository.findOneBy({ label: roleLabel }),
    ]);

    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    if (!role) throw new NotFoundException(`Role ${roleLabel} not found`);

    return { user, role };
  }
  async addRoleToUser(userId: number, roleLabel: string): Promise<void> {
    const { user, role } = await this.validateUserAndRole(userId, roleLabel);

    if (!user.roles.some((r) => r.id === role.id)) {
      user.roles.push(role);
      await this.userRepository.save(user);
    }
  }
  async assignDriverRole(userId: number): Promise<void> {
    return this.addRoleToUser(userId, 'Driver');
  }
  async assignAdminRole(userId: number): Promise<void> {
    return this.addRoleToUser(userId, 'Admin');
  }
}
