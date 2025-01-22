import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogStatus } from './blogs-status.enum';
import { UpdateBlogDto } from './dto/update-board.to';
import { BlogStatusValidationPipe } from './pipes/blog-status-validation.pipe';

@Controller('api/boards')
@UsePipes(ValidationPipe)
export class BlogsController {
    // 생성자 주입
    constructor(private boardsService: BlogsService) { }

    // 블로그 조회 기능
    @Get('/')
    getAllBlogs(): Blog[] {
        return this.boardsService.getAllBlogs();
    }

    // 특정 블로그 조회 기능
    @Get('/:id')
    getBlogDetailById(@Param('id') id: number): Blog {
        return this.boardsService.getBlogDetailById(id);
    }

    // 키워드(작성자)로 검색한 블로그 조회 기능
    @Get('/search/:keyword')
    getBlogsByKeyword(@Query('author') author: string): Blog[] {
        return this.boardsService.getBlogsByKeyword(author);
    }


    // 블로그 작성 기능
    @Post('/')
    createBlogs(@Body() createBlogDto: CreateBlogDto) {
        return this.boardsService.createBlog(createBlogDto);
    }

    // 특정 번호의 블로그 수정
    @Put('/:id')
    updateBlogById(
        @Param('id') id: number,
        @Body() updateBlogDto: UpdateBlogDto): Blog {
        return this.boardsService.updateBlogById(id, updateBlogDto);
    }

    // 특정 번호의 블로그 일부 수정
    @Patch('/:id')
    updateBlogStatusById(
        @Param('id') id: number,
        @Body('status', BlogStatusValidationPipe) status: BlogStatus): Blog {
        return this.boardsService.updateBlogStatusById(id, status);
    }

    // 블로그 삭제 기능
    @Delete('/:id')
    deleteBlogById(@Param('id') id: number): void {
        this.boardsService.deleteBlogById(id);
    }
}
