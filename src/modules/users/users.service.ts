import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Todo verif si l'email existe deja
  async create(data: RegisterDto): Promise<User> {
    const saltRounds = 9;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const user = this.userRepository.create({
      ...data,
      picture: undefined,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
