import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletDto } from '../dto/wallet.dto';
import { UsersService } from '../modules/users/users.service';
import { RequestWithUser } from '../dto/request-with-user.dto';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly usersService: UsersService,
  ) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyWallet(@Req() req: RequestWithUser): Promise<WalletDto> {
    const user = await this.usersService.findById(req.user.id, {
      relations: ['wallet'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    if (!user.wallet) {
      throw new NotFoundException('Wallet non trouvé');
    }

    return {
      id: user.wallet.id,
      balance: user.wallet.balance,
      createdAt: user.wallet.createdAt,
    };
  }
  @Get(':userId')
  getWallet(@Param('userId') userId: number) {
    return this.walletService.getWalletByUserId(userId);
  }
}
