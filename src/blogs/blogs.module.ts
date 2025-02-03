import { Module } from '@nestjs/common';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { BlogsController } from './blogs.controller';  
import { BlogsService } from './blogs.service';  
import { Blog } from './blogs.entity'; // Blog 엔티티 가져오기  
import { Comment } from './comment.entity'; // Comment 엔티티 가져오기  

@Module({  
  imports: [  
    TypeOrmModule.forFeature([Blog, Comment]), // Blog 및 Comment 엔티티에 대한 리포지토리 등록  
  ],  
  controllers: [BlogsController],  
  providers: [BlogsService],  
})  
export class BlogsModule {}