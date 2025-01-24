import { Injectable, NotFoundException } from '@nestjs/common';  
import { Blog } from './blogs.entity';  
import { BlogStatus } from './blogs-status.enum';  
import { CreateBlogDto } from './dto/create-blog.dto';  
import { UpdateBlogDto } from './dto/update-blog.dto';  
import { Comment } from './comment.entity';  
import { CreateCommentDto } from './dto/create-comment.dto';  

@Injectable()  
export class BlogsService {  
    private blogs: Blog[] = []; // 블로그 배열  
    private comments: Comment[] = []; // 댓글 배열  
    private nextCommentId = 1; // 다음 댓글 ID   

    // 블로그 조회 기능  
    getAllBlogs(): Blog[] {  
        if (this.blogs.length === 0) {  
            throw new NotFoundException('No blogs found');  
        }  
        return this.blogs.filter(blog => blog.status !== BlogStatus.PRIVATE);  
    }  

    // 특정 블로그 조회 기능  
    getBlogDetailById(id: string): Blog {  // id를 string으로 받음  
        const blogId = parseInt(id, 10); // 내부에서 변환  
        const foundBlog = this.blogs.find(blog => blog.id === blogId);  
        if (!foundBlog) {  
            throw new NotFoundException(`Blog with ID ${blogId} not found`);  
        }  
        if (foundBlog.status === BlogStatus.PRIVATE) {  
            throw new NotFoundException(`Blog with ID ${blogId} is private and cannot be accessed`);  
        }  
        return foundBlog;  
    }  

    // 키워드(작성자)로 검색한 블로그 조회 기능  
    getBlogsByKeyword(author: string): Blog[] {  
        const foundBlogs = this.blogs.filter(blog => blog.author === author);  
        if (foundBlogs.length === 0) {  
            throw new NotFoundException(`No blogs found by AUTHOR ${author}`);  
        }  
        return foundBlogs.filter(blog => blog.status !== BlogStatus.PRIVATE);  
    }  

    // 블로그 작성 기능  
    createBlog(createBlogDto: CreateBlogDto): Blog {  
        const { author, title, contents } = createBlogDto;  

        const blog: Blog = {  
            id: this.blogs.length + 1, // Auto Increment  
            author,  
            title,  
            contents,  
            status: BlogStatus.PUBLIC,  
            createdAt: new Date(),  
            updatedAt: new Date(),  
            comments: []  
        };  

        this.blogs.push(blog); 
        console.log('Current Blogs after addition:', this.blogs); // 추가 후 전체 블로그 출력  
        return blog; // 성공적으로 생성된 블로그 반환  
    }  

    // 특정 번호의 블로그 수정  
    updateBlogById(id: string, updateBlogDto: UpdateBlogDto): Blog { // id를 string으로 받음  
        const blogId = parseInt(id, 10); // 내부에서 변환  
        const foundBlog = this.getBlogDetailById(id);  
        const { title, contents } = updateBlogDto;  

        foundBlog.title = title;  
        foundBlog.contents = contents;  
        foundBlog.updatedAt = new Date();  

        return foundBlog; // 수정된 블로그 반환  
    }  

    // 특정 번호의 블로그 일부 수정  
    updateBlogStatusById(id: string, status: BlogStatus): Blog { // id를 string으로 받음  
        const blogId = parseInt(id, 10); // 내부에서 변환  
        const foundBlog = this.getBlogDetailById(id);  
        foundBlog.status = status;  
        foundBlog.updatedAt = new Date();  

        return foundBlog; // 수정된 블로그 반환  
    }  

    // 블로그 삭제  
    deleteBlogById(id: string): void { // id를 string으로 받음  
        const blogId = parseInt(id, 10); // 내부에서 변환  

        const foundBlogIndex = this.blogs.findIndex(blog => blog.id === blogId);  
        if (foundBlogIndex === -1) {  
            throw new NotFoundException(`Blog with ID ${blogId} not found`);  
        }  
        this.blogs.splice(foundBlogIndex, 1); // 블로그 삭제  
    }  

    // 댓글 추가 기능  
    addComment(id: string, createCommentDto: CreateCommentDto): Comment {  
        const blogId = parseInt(id, 10); // 내부에서 변환  
        const foundBlog = this.blogs.find(blog => blog.id === blogId);  
        if (!foundBlog) {  
            console.log('Blog not found for ID:', blogId);  
            throw new NotFoundException(`Blog with ID ${blogId} not found`);  
        }   
        const { text, author } = createCommentDto;  
    
        const comment: Comment = {  
            id: this.nextCommentId++, // 다음 댓글 ID  
            text,  
            author,  
            blog: foundBlog,  
            createdAt: new Date(),  
        };  
    
        this.comments.push(comment); // 댓글 추가  
        console.log('Comment added:', comment); // 추가된 댓글 출력  
        return comment; // 생성된 댓글 반환  
    } 

    // 특정 블로그의 댓글 조회  
    getCommentsForBlog(id: string): Comment[] {  
        const blogId = parseInt(id, 10); // 내부에서 변환  
        
        const foundBlog = this.blogs.find(blog => blog.id === blogId);  
        if (!foundBlog) {  
            console.log('Blog not found for ID:', blogId); // 블로그가 없을 경우 출력  
            throw new NotFoundException(`Blog with ID ${blogId} not found`);  
        }  
    
        const commentsForBlog = this.comments.filter(comment => comment.blog.id === blogId); // 해당 블로그의 댓글 반환  
        console.log('Comments for Blog ID:', blogId, commentsForBlog); // 댓글 목록 출력  
        return commentsForBlog;   
    }
}