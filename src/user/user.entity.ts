import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('users') // Specify table name as 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // 'select: false' empêche le mot de passe d'être retourné par défaut dans les requêtes
  password: string;

    /**
   * Hook exécuté automatiquement avant l'insertion d'un nouvel enregistrement.
   * Il sert à hacher le mot de passe s'il a été fourni.
   */
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ default: true })
  isActive: boolean;


  @Column({ type: 'varchar', nullable: true, select: false })
  currentHashedRefreshToken?: string | null;

  /**
   * Met à jour le refresh token haché pour l'utilisateur.
   * Le hachage est essentiel pour la sécurité en base de données.
   * @param refreshToken Le token en clair à hacher et stocker.
   */
  async setCurrentHashedRefreshToken(refreshToken: string | null) {
    if (!refreshToken) {
      this.currentHashedRefreshToken = null;
      return;
    }
    const salt = await bcrypt.genSalt();
    this.currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
  }

  // --- TIMESTAMPS & SOFT DELETE ---

  /**
   * La date et l'heure de la création de l'enregistrement.
   * Géré automatiquement par TypeORM.
   */
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  /**
   * La date et l'heure de la dernière mise à jour de l'enregistrement.
   * Géré automatiquement par TypeORM à chaque mise à jour.
   */
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;

  /**
   * La date et l'heure de la suppression "douce" (soft delete).
   * Si cette colonne est non-nulle, l'enregistrement est considéré comme archivé.
   * Les requêtes find* ne le retourneront plus automatiquement.
   */
  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt?: Date; // Le `?` indique que la propriété peut être undefined
}
