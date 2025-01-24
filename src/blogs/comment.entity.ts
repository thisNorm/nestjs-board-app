import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';  
import { Blog } from './blogs.entity';  

@Entity('comments') // 데이터베이스에서 사용할 테이블 이름  
export class Comment {  
    @PrimaryGeneratedColumn()  
    id: number;  // 댓글 ID  

    @Column()  
    text: string;  // 댓글 내용  

    @Column()  
    author: string;  // 댓글 작성자  

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })  
    createdAt: Date; // 생성 날짜  

    @ManyToOne(() => Blog, blog => blog.comments) // 블로그와의 관계 설정  
    blog: Blog;  
}