import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'typeorm';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly connection: Connection,
  ) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  async getDbStatus() {
    try {
      // Simple query to test connection
      await this.connection.query('SELECT 1');
      return { status: 'ok', message: 'Database connection successful' };
    } catch (error) {
      return { status: 'error', message: 'Database connection failed', error: error.message };
    }
  }
}
