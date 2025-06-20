import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}