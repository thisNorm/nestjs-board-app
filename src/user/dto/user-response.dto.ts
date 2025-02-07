import { UserRole } from "src/user/entities/user-role.enum";
import { User } from "src/user/entities/user.entity";

export class UserResponseDto {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}