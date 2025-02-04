import { Board } from "../boards.entity";

export class UserResponseDto{
    email: string;
    role: UserRole;

    constructor(user: User){
        this.email = user.email;
        this.role = user.role;
        
    }
}