import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from './blogs.entity';
import { BlogStatus } from './blogs-status.enum';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-board.to';

@Injectable()
export class BlogsService {
    // 데이터 베이스 
    private boards: Blog[] = [];

    // 블로그 조회 기능
    getAllBlogs(): Blog[] {
        const foundBlog = this.boards;
        if (foundBlog.length === 0) {
            throw new NotFoundException(`Blog is not found`);
        }
        const visibleBlogs = foundBlog.filter((board) => board.status !== 'PRIVATE');
        return visibleBlogs;
    }

    // 특정 블로그 조회 기능
    getBlogDetailById(id: number): Blog {
        const foundBlog = this.boards.find((board) => board.id == id)
        if (!foundBlog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        if (foundBlog.status === 'PRIVATE') {
            throw new NotFoundException(`Blog with ID ${id} is private and cannot be accessed`);
        }
        return foundBlog;
    }

    // 키워드(작성자)로 검색한 블로그 조회 기능
    getBlogsByKeyword(author: string): Blog[] {
        const foundBlog = this.boards.filter((board) => board.author === author)
        if (foundBlog.length === 0) {
            throw new NotFoundException(`Blog with AUTHOR ${author} not found`);
        }
        return foundBlog.filter((board) => board.status !== BlogStatus.PRIVATE);
    }

    // 블로그 작성 기능
    createBlog(createBlogDto: CreateBlogDto) {
        const { author, title, contents } = createBlogDto;

        const board: Blog = {
            id: this.boards.length + 1, // 임시 Auto Increament 기능
            author,
            title,
            contents,
            status: BlogStatus.PUBLIC
        }
        const saveBlog = this.boards.push(board);
        return saveBlog;
    }

    // 특정 번호의 블로그 수정
    updateBlogById(id: number, updateboardDto: UpdateBlogDto): Blog {
        const foundBlog = this.getBlogDetailById(id);
        const { title, contents } = updateboardDto;

        foundBlog.title = title;
        foundBlog.contents = contents;

        return foundBlog;
    }

    // 특정 번호의 블로그 일부 수정
    updateBlogStatusById(id: number, status: BlogStatus): Blog {
        const foundBlog = this.getBlogDetailById(id);
        foundBlog.status = status;
        return foundBlog;
    }

    // 블로그 삭제
    deleteBlogById(id: number): void {
        const numericId = Number(id);
        const foundBlog = this.boards.find((board) => board.id === numericId);
        if (!foundBlog) {
            throw new NotFoundException(`Blog with ID ${numericId} not found`);
        }
        this.boards = this.boards.filter((board) => board.id != numericId);
    }

    // deleteBlogById(id: number): void {  
    // 느슨한 동등 비교 사용  
    //     const foundBlog = this.boards.find((board) => board.id == id);

    //     if (!foundBlog) {  
    //         throw new NotFoundException(`Blog with ID ${id} not found`);  
    //     }  

    //     this.boards = this.boards.filter((board) => board.id !== id);
}
