import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRole } from './users-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // 회원 가입 기능
    async createUser(createUserDto: createUserDto): Promise<User> {
        const { username, password, email, role } = createUserDto;
        if (!username || !password || !email || !role) {
            throw new BadRequestException(`Something went wrong.`);
        }

        await this.checkEmailExist(email);

        const hashedPassword = this.hashPassword(password);

        const newUser: User = {
            id: 0,
            username,
            password: hashedPassword,
            email,
            role: UserRole.USER
        };
        
        const createUser = await this.userRepository.save(newUser);
        return createUser;
    }

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: ( email )});
        if(existingUser) {
            throw new ConflictException('Email already exists');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(); // 솔트 생성
        return await bcrypt.hash(password, salt); // 비밀번호 생성
    }
}