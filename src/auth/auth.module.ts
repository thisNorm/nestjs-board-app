import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // User 엔터티를 TypeORM 모듈에 등록
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
