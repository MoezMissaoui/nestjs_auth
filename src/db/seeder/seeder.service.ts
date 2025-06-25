import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { createUserFactory } from '../../user/user.factory';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Méthode principale pour lancer le seeding
   */
  async seed() {
    this.logger.log('Starting seeding process...');
    await this.seedUsers();
    this.logger.log('Seeding complete.');
  }

  /**
   * Crée un nombre défini d'utilisateurs
   */
  private async seedUsers() {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      this.logger.log('Users table is not empty. Skipping seeding.');
      return;
    }

    this.logger.log('Seeding users...');
    const usersToCreate = 50;
    const userPromises: Promise<User>[] = [];

    for (let i = 0; i < usersToCreate; i++) {
      const userData = createUserFactory();
      const newUser = this.userRepository.create(userData);
      userPromises.push(this.userRepository.save(newUser));
    }

    await Promise.all(userPromises);
    this.logger.log(`Successfully seeded ${usersToCreate} users.`);
  }
}