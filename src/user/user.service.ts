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

  async findOneWithCurrentHashedRefreshToken(id: number): Promise<User> {
    // Cette méthode est utilisée pour récupérer un utilisateur avec son token de rafraîchissement haché.
    // Elle est utile pour les opérations de rafraîchissement de token.
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.currentHashedRefreshToken') // Ajoute explicitement le champ 'password' à la sélection
      .getOne();
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID #${id} non trouvé`);
    }
    return user;
  }

  /**
   * Enregistre un nouvel utilisateur ou met à jour un utilisateur existant.
   * @param user L'entité User à enregistrer.
   * @returns L'entité User enregistrée, y compris le mot de passe haché.
   */
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /**
   * Crée un nouvel utilisateur avec les données fournies.
   * @param data Les données de l'utilisateur à créer.
   * @returns L'entité User créée.
   */
  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
