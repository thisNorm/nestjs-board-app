import { UserRole } from "../user-role.enum";
import { User } from "../user.entity";

export class UserResponseDto {
    id: number;
    username: string;
    email: string;
    role: UserRole;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;

    }
}