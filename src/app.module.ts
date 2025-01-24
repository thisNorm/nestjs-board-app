import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BlogsModule } from './blogs/blogs.module';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './configs/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    BoardsModule,
    BlogsModule
  ],
  controllers: [],
})
export class AppModule { }