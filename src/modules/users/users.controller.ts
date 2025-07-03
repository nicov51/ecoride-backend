import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from '../../dto/user-response.dto';
import { CreateUserDto } from '../../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('email/:email')
  async getUsersByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findByEmail(email);
    return user ? new UserResponseDto(user) : null;
  }
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(data);
    return new UserResponseDto(user);
  }
}
