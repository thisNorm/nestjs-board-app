import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
    constructor(private AuthService: AuthService) { }

    // 회원 가입 기능
    @Post('/signup')
    async createUser(@Body() createUserDto: createUserDto): Promise<UserResponseDto> {
        const userResponseDto = new UserResponseDto(await this.authService.createUser(createUserDto))
        return userResponseDto;
    }

    // 로그인 기능
    @Post('/siginin')
    async signIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
        this.authService.signIn(loginUserDto, res);


        // [2] JWT를 쿠키에 저장
        res.cookie('Authorization', 'accessToken', {
            httpOnly: true,
            secure: false,
            maxagge: 360000,
            sameSite: 'none'
        });
        res.send('message: "Login Success"');
    }
}