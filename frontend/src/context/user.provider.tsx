import UserContext, {User} from "./user.context";
import { useState, ReactNode } from 'react';

export const UserProvider = ({ children }:{children:ReactNode}) => {
    const [user, setUser] = useState<User|null>(null);

    return (
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    );
}
