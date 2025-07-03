import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
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
