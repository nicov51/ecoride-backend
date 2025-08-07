import { RegisterDto } from './register.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto extends RegisterDto {
  @IsString()
  @IsOptional()
  employeeNumber?: string;
}
