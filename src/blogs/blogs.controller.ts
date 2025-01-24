import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';  
import { BlogsService } from './blogs.service';  
import { Blog } from './blogs.entity';  
import { CreateBlogDto } from './dto/create-blog.dto';  
import { BlogStatus } from './blogs-status.enum';  
import { UpdateBlogDto } from './dto/update-blog.dto';  
import { BlogStatusValidationPipe } from './pipes/blog-status-validation.pipe';  
import { CreateCommentDto } from './dto/create-comment.dto'; // 댓글 DTO 추가  
import { Comment } from './comment.entity'; // 댓글 엔티티 추가  

@Controller('api/blogs')  
@UsePipes(ValidationPipe)  
export class BlogsController {  
    constructor(private blogsService: BlogsService) { }  

    // 블로그 조회 기능  
    @Get('/')  
    getAllBlogs(): Blog[] {  
        return this.blogsService.getAllBlogs();  
    }  

    // 특정 블로그 조회 기능  
    @Get('/:id')  
    getBlogDetailById(@Param('id') id: string): Blog {  // id를 string으로 받기  
        return this.blogsService.getBlogDetailById(id);  // string을 그대로 전달  
    }  

    // 키워드(작성자)로 검색한 블로그 조회 기능  
    @Get('/search')  
    getBlogsByKeyword(@Query('author') author: string): Blog[] {  
        return this.blogsService.getBlogsByKeyword(author);  
    }  

    // 블로그 작성 기능  
    @Post('/')  
    createBlogs(@Body() createBlogDto: CreateBlogDto) {  
        return this.blogsService.createBlog(createBlogDto);  
    }  

    // 특정 번호의 블로그 수정  
    @Put('/:id')  
    updateBlogById(  
        @Param('id') id: string,  // id를 string으로 받기  
        @Body() updateBlogDto: UpdateBlogDto): Blog {  
        return this.blogsService.updateBlogById(id, updateBlogDto);  
    }  

    // 특정 번호의 블로그 일부 수정  
    @Patch('/:id')  
    updateBlogStatusById(  
        @Param('id') id: string,  
        @Body('status', BlogStatusValidationPipe) status: BlogStatus): Blog {  
        return this.blogsService.updateBlogStatusById(id, status);  
    }  

    // 블로그 삭제 기능  
    @Delete('/:id')  
    deleteBlogById(@Param('id') id: string): void {  // id를 string으로 받기  
        this.blogsService.deleteBlogById(id);  
    }  

    // 댓글 추가 기능  
    @Post('/:id/comments')  
    addComment(  
        @Param('id') blogId: string,  
        @Body() createCommentDto: CreateCommentDto  
    ): Comment {  
        return this.blogsService.addComment(blogId, createCommentDto);  
    }

    // 특정 블로그의 댓글 조회 기능  
    @Get('/:id/comments')  
    getCommentsForBlog(@Param('id') blogId: string): Comment[] {  // blogId를 string으로 받기  
        return this.blogsService.getCommentsForBlog(blogId);  // string을 그대로 전달  
    }  
}