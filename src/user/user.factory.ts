import { faker } from '@faker-js/faker';
import { User } from './user.entity';

// Cette fonction crée une instance de User avec des données aléatoires
export const createUserFactory = (): Partial<User> => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email().toLowerCase(),
    password: 'password', // Utilisez un mot de passe par défaut pour les tests
  };
};