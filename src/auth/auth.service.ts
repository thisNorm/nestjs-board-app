import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRole } from './users-role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // 회원 가입입 기능
    async createUser(createUserDto: createUserDto): Promise<User> {
        const { username, password, email, role } = createUserDto;
        if (!username || !password || !email || !role) {
            throw new BadRequestException(`Something went wrong.`);
        }
        const newUser: User = {
            id: 0, // 임시 초기화
            username, // author : createBoardDto.author
            password,
            email,
            role: UserRole.USER
        }
        const createUser = await this.userRepository.save(newUser);
        return createUser;
    }
}