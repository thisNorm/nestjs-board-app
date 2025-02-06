import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BlogsModule } from './blogs/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { GlobalMoudle } from './global.module';
import { APP_FILTER } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from './common/interceptors/unauthorization.filter';
import { loggingInterceptor } from './common/interceptors/logging.interceptor';


@Module({
  imports: [
    GlobalMoudle,
    TypeOrmModule.forRoot(typeOrmConfig),
    BoardsModule,
    BlogsModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter, // 전역 필터 등록}
    },
    {
      provide: APP_FILTER,
      useClass: loggingInterceptor, // 전역 필터 등록}
    },
  ]
})
export class AppModule { }