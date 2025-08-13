import { RegisterDto } from './register.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto extends RegisterDto {
  @IsString()
  @IsOptional()
  employeeNumber?: string;

  @IsBoolean()
  @IsOptional()
  isSuspended?: boolean = false; // Valeur par défaut
}
