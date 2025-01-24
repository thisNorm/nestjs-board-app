import { BlogStatus } from "./blogs-status.enum"; // 블로그 상태 열거형  
import { Comment } from './comment.entity'; // 댓글 엔티티 추가  

export class Blog {  
    id: number;                // 블로그 ID  
    author: string;           // 블로그 작성자  
    title: string;            // 블로그 제목  
    contents: string;         // 블로그 내용  
    status: BlogStatus;       // 블로그 상태 (PUBLIC, PRIVATE 등)  
    createdAt: Date;          // 블로그 작성 날짜  
    updatedAt: Date;          // 블로그 수정 날짜  
    comments: Comment[];      // 댓글 배열  
}