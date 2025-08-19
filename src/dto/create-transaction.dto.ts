import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  walletId: number;

  @IsNumber()
  amount: number;

  @IsString()
  type: string;

  @IsString()
  description: string;
}
