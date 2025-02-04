import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

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
    async signIn(@Body() loginUserDto: LoginUserDto): Promise<string> {
        const message = this.AuthService.signIn(loginUserDto);
        return message;
    }
}