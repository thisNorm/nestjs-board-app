import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';  
import { BlogsService } from './blogs.service';  
import { Blog } from './blogs.entity';  
import { CreateBlogDto } from './dto/create-blog.dto';  
import { BlogStatus } from './blogs-status.enum';  
import { UpdateBlogDto } from './dto/update-blog.dto';  
import { BlogStatusValidationPipe } from './pipes/blog-status-validation.pipe';  
import { CreateCommentDto } from './dto/create-comment.dto';  
import { Comment } from './comment.entity';  
import { BlogResponseDto } from './dto/blog-response.dto'; // 추가: 블로그 응답 DTO  
import { BlogSearchResponseDto } from './dto/blog-search-response.dto'; // 추가: 블로그 검색 응답 DTO  

@Controller('api/blogs')  
@UsePipes(ValidationPipe)  
export class BlogsController {  
    constructor(private blogsService: BlogsService) { }  

    // 모든 블로그를 조회하는 기능  
    @Get('/')  
    async getAllBlogs(): Promise<BlogResponseDto[]> {  
        const blogs: Blog[] = await this.blogsService.getAllBlogs();  
        const blogsResponseDto = blogs.map(blog => new BlogResponseDto(blog));  
        return blogsResponseDto;  
    }   

    // 특정 블로그를 ID로 조회하는 기능  
    @Get('/:id')  
    async getBlogDetailById(@Param('id') id: number): Promise<BlogResponseDto> {  
        const blogResponseDto = new BlogResponseDto(await this.blogsService.getBlogDetailById(id));  
        return blogResponseDto;  
    }  

    // 작성자 키워드로 블로그를 검색하는 기능  
    @Get('/search')  
    async getBlogsByKeyword(@Query('author') author: string): Promise<BlogSearchResponseDto[]> {  
        const blogs: Blog[] = await this.blogsService.getBlogsByKeyword(author);  
        const blogsResponseDto = blogs.map(blog => new BlogSearchResponseDto(blog));  
        return blogsResponseDto;  
    }  

    // 블로그를 생성하는 기능  
    @Post('/')  
    async createBlogs(@Body() createBlogDto: CreateBlogDto): Promise<BlogResponseDto> {  
        const blogResponseDto = new BlogResponseDto(await this.blogsService.createBlog(createBlogDto));  
        return blogResponseDto;  
    }  

    // 특정 블로그를 ID로 수정하는 기능  
    @Put('/:id')  
    async updateBlogById(  
        @Param('id') id: number,  
        @Body() updateBlogDto: UpdateBlogDto): Promise<BlogResponseDto> {  
        const blogResponseDto = new BlogResponseDto(await this.blogsService.updateBlogById(id, updateBlogDto));  
        return blogResponseDto;  
    }  

    // 특정 번호의 게시글 일부 수정
    @Patch('/:id')
    async updateBoardStatusById(
        @Param('id') id: number,
        @Body('status', BlogStatusValidationPipe )status: BlogStatus): Promise<void>{
        await this.blogsService.updateBlogStatusById(id,status);
    }


    // 특정 블로그를 삭제하는 기능  
    @Delete('/:id')  
    async deleteBlogById(@Param('id') id: number): Promise<void> {  
        await this.blogsService.deleteBlogById(id);  
    }  

    // 특정 블로그에 댓글을 추가하는 기능  
    @Post('/:id/comments')  
    async addComment(  
        @Param('id') blogId: number,  
        @Body() createCommentDto: CreateCommentDto  
    ): Promise<Comment> {  
        return this.blogsService.addComment(blogId, createCommentDto);  
    }  

    // 특정 블로그의 댓글을 조회하는 기능  
    @Get('/:id/comments')  
    async getCommentsForBlog(@Param('id') blogId: number): Promise<Comment[]> {  
        return this.blogsService.getCommentsForBlog(blogId);  
    }  
}