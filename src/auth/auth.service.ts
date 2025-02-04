import { BadRequestException, ConflictException, Injectable, NotAcceptableException, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRole } from './users-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'
import { LoginUsrDto } from './dto/login-user/dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
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

    // 로그인 기능
    async signIn(loginUserDto: loginUserDto): Promise<void> {
        const { email, password } = loginUserDto;

        try {
            const existingUser = await this.checkEmailExist(email);

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // [1] JWT 토큰 생성
            const payload = {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role
            };
            const accessToken = await this.jwtService.sign(payload);

            return accessToken;
        } catch (error) {
            throw error;
        }
    }








    async findUserByEmail(email: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: (email) });
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        return existingUser;
    }

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: (email) });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(); // 솔트 생성
        return await bcrypt.hash(password, salt); // 비밀번호 생성
    }
}