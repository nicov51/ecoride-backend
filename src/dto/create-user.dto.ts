import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  firstName: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  address: string;

  @IsDateString()
  birthDate: string;

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
