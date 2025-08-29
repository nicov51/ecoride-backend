import {
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(@Req() req: Request & { user: { id: number } }) {
    return this.notificationsService.getUserNotifications(req.user.id);
  }
  @Put(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.markAsRead(id);
    return { message: 'Notification marquée comme lue' };
  }
}
