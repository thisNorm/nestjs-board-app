// blog-search-response.dto.ts  
import { Blog } from "../blogs.entity";  

export class BlogSearchResponseDto {  
    id: number; // 블로그 ID 추가  
    author: string;  
    title: string;  
    contents: string;  

    constructor(blog: Blog) {  
        this.id = blog.id; // 블로그 ID 추가  
        this.author = blog.author;  
        this.title = blog.title;  
        this.contents = blog.contents;  
    }  
}