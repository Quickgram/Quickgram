import { createContext } from "react";
import User from "../model/user";

export const CurrentUserContext = createContext<User | null>(null);
