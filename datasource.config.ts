import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/user/user.entity'; // On importera notre entité ici

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql', // ou 'postgres', 'sqlite', etc.
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [User], // Indique à TypeORM quelles entités charger

  // IMPORTANT : Indiquez où se trouvent vos fichiers de migration.
  migrations: ['dist/db/migrations/*.js'],
  
  // Vous pouvez désactiver la synchronisation si vous gérez tout via les migrations
  synchronize: true, 
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

