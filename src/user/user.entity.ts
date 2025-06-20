import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users') // Specify table name as 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

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
