import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('employees')
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.adminService.createEmployee(dto);
  }
  @Get('employees')
  getEmployees() {
    return this.adminService.getEmployees();
  }
  @Get('stats/rides')
  getRideStats() {
    return this.adminService.getRideStatistics();
  }
  @Get('stats/credits')
  getCreditStats() {
    return this.adminService.getCreditStatistics();
  }
  @Get('stats/total-credits')
  getTotalCredits() {
    return this.adminService.getTotalCredits();
  }
  @Post('suspend/:userId')
  suspendUser(@Param('userId') userId: number) {
    return this.adminService.suspendUser(userId);
  }
  @Post('unsuspended/:userId')
  unsuspendUser(@Param('userId') userId: number) {
    return this.adminService.unsuspendUser(userId);
  }
}
