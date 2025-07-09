import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Length(6)
  password: string;

  @IsNotEmpty()
  address: string;

  @IsDateString()
  @Type(() => Date)
  birthDate: Date;

  @IsOptional()
  picture?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsString()
  pseudo: string;

  @IsPhoneNumber('FR')
  phone: string;
}
