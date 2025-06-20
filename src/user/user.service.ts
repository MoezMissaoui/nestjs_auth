import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    // C'est ici que la magie opère. NestJS, via TypeOrmModule.forFeature,
    // injecte le "Repository" correspondant à l'entité User.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Trouve un utilisateur par son adresse e-mail.
   * C'est la méthode cruciale pour votre module d'authentification.
   * Elle sélectionne explicitement le mot de passe qui est masqué par défaut.
   * @param email L'adresse e-mail de l'utilisateur à trouver.
   * @returns L'entité User complète, y compris le mot de passe.
   */
  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password') // Ajoute explicitement le champ 'password' à la sélection
      .getOne();
    return user ?? undefined;
  }

  /**
   * Trouve un utilisateur par son ID.
   * @param id L'ID de l'utilisateur à trouver.
   * @returns L'entité User sans le mot de passe.
   */
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID #${id} non trouvé`);
    }
    return user;
  }
}
