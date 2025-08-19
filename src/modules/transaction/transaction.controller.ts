import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(dto);
  }
}
