// blog-response.dto.ts  
import { Blog } from '../blogs.entity';  

export class BlogResponseDto {  
    author: string;  
    title: string;  
    contents: string;  
    status: string;  // "PUBLIC" 또는 "PRIVATE"  
    createdAt: Date;  
    updatedAt: Date;  
    comments: any[]; // 댓글을 포함하도록 설정 (구조에 맞게 수정이 필요할 경우 추가)  
    id: number;  

    constructor(blog: Blog) {  
        this.author = blog.author;  
        this.title = blog.title;  
        this.contents = blog.contents;  
        this.status = blog.status;  
        this.createdAt = blog.createdAt;  
        this.updatedAt = blog.updatedAt;  
        this.comments = blog.comments; // comments가 Blog 엔티티의 프로퍼티라고 가정  
        this.id = blog.id;  
    }  
}