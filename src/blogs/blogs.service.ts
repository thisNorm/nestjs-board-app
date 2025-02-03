import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from './blogs.entity';
import { BlogStatus } from './blogs-status.enum';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,

        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>
    ) { }

    // 블로그 전체 조회  
    async getAllBlogs(): Promise<Blog[]> {
        const blogs = await this.blogRepository.find();
        if (!blogs.length) {
            throw new NotFoundException('No blogs found');
        }
        return blogs.filter(blog => blog.status !== BlogStatus.PRIVATE);
    }

    // 특정 블로그 조회  
    async getBlogDetailById(id: number): Promise<Blog> {
        const foundBlog = await this.blogRepository.findOne({ where: { id } });

        if (!foundBlog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        if (foundBlog.status === BlogStatus.PRIVATE) {
            throw new NotFoundException(`Blog with ID ${id} is private and cannot be accessed`);
        }

        return foundBlog;
    }

    // 작성자로 블로그 검색  
    async getBlogsByKeyword(author: string): Promise<Blog[]> {
        if (!author) {
            throw new BadRequestException('작성자를 입력해야 합니다.');
        }

        const foundBlogs = await this.blogRepository.findBy({ author });
        if (foundBlogs.length === 0) {
            throw new NotFoundException(`작성자 ${author}의 블로그를 찾을 수 없습니다.`);
        }

        return foundBlogs;
    }

    // 블로그 생성  
    async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
        const blog: Blog = this.blogRepository.create({
            ...createBlogDto,
            status: BlogStatus.PUBLIC,
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: []
        });

        return await this.blogRepository.save(blog);
    }

    // 블로그 수정  
    async updateBlogById(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
        const foundBlog = await this.getBlogDetailById(id);
        const { title, contents } = updateBlogDto;

        if (!title || !contents) {
            throw new BadRequestException('제목과 내용을 모두 입력해야 합니다.');
        }

        foundBlog.title = title;
        foundBlog.contents = contents;
        foundBlog.updatedAt = new Date();

        return await this.blogRepository.save(foundBlog);
    }

    // 특정 번호의 게시글 일부 수정  
    async updateBlogStatusById(id: number, status: BlogStatus): Promise<void> {
        const result = await this.blogRepository.update(id, { status }); // 게시글 존재 여부 확인  
        if (result.affected === 0) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }
    }

    // 블로그 삭제  
    async deleteBlogById(id: number): Promise<void> {
        const foundBlog = await this.getBlogDetailById(id);

        // 블로그와 그에 연결된 댓글을 삭제합니다.  
        await this.blogRepository.remove(foundBlog);
    }

    // 댓글 추가  
    async addComment(id: number, createCommentDto: CreateCommentDto): Promise<Comment> {
        const foundBlog = await this.blogRepository.findOne({ where: { id } });

        if (!foundBlog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        if (foundBlog.status === BlogStatus.PRIVATE) {
            throw new NotFoundException(`Cannot add comment to a private blog (ID: ${id})`);
        }

        const comment: Comment = this.commentRepository.create({
            ...createCommentDto,
            blog: foundBlog,
            createdAt: new Date(),
        });

        return await this.commentRepository.save(comment);
    }

    // 블로그 댓글 조회  
    async getCommentsForBlog(id: number): Promise<Comment[]> {
        const foundBlog = await this.blogRepository.findOne({ where: { id } });

        if (!foundBlog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        return await this.commentRepository.find({ where: { blog: foundBlog } });
    }
}