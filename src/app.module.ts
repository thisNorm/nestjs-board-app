import { Module, ValidationPipe } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter';
import { loggingInterceptor } from './common/interceptors/logging.interceptor';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticlesModule,
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: loggingInterceptor,
    },
    {
        provide: APP_PIPE,
        useClass: ValidationPipe,
    },
  ]
})
export class AppModule {}