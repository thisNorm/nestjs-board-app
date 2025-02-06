import { Body, Controller, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private AuthService: AuthService) { }

    // 회원 가입 기능
    @Post('/signup')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        this.logger.verbose(`Visitor is try to creating a new account with title: ${createUserDto.email}`);

        const userResponseDto = new UserResponseDto(await this.AuthService.createUser(createUserDto))

        this.logger.verbose(`New account email with ${createUserDto.email} created Successfully`);
        return userResponseDto;
    }

    // 로그인 기능
    @Post('/signin')
    async signIn(@Body() signInRequestDto: SignInRequestDto, @Res() res: Response): Promise<void> {
        this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

        const accessToken = await this.AuthService.signIn(signInRequestDto);

        // [2] JWT를 헤더에 저장
        res.setHeader('Authorization', accessToken);

        res.send({ message: "Login Success", accessToken });
        this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);
    }
}