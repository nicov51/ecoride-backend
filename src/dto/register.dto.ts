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
