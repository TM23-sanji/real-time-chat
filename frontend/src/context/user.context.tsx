import { createContext } from 'react';

export interface User {
    name: string;
    email: string;
    }

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    }

const UserContext= createContext<UserContextType|undefined>(undefined);

export default UserContext