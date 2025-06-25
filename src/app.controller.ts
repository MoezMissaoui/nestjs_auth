import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly connection: Connection,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Get hello message', description: 'Returns a welcome message.' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  @ApiOperation({ summary: 'Check database connection status', description: 'Checks if the database connection is active.' })
  @ApiResponse({ status: 200, description: 'Database connection successful.' })
  @ApiResponse({ status: 500, description: 'Database connection failed.' })
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
