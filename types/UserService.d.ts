import { UserRole } from './UserRole';

type getInfo = (id: string, role: UserRole) => Promise<void>; 

interface UserService {
    getInfo: (id: string, role:UserRole)
        => Promise<void>
}