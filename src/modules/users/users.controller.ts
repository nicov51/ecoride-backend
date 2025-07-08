import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from '../../dto/user-response.dto';
import { RegisterDto } from '../../dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../../dto/request-with-user.dto';

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

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user);
  }
  @Post()
  async createUser(@Body() data: RegisterDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(data);
    return new UserResponseDto(user);
  }
}
