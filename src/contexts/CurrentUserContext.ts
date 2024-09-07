import { createContext } from 'react';
import User from '../model/User';

export const CurrentUserContext = createContext<User | null>(null);
