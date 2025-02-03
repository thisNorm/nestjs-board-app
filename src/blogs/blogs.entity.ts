import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';  
import { BlogStatus } from "./blogs-status.enum"; // 블로그 상태 열거형  
import { Comment } from './comment.entity'; // 댓글 엔티티 추가  

@Entity('blogs') // 데이터베이스에서 사용할 테이블 이름  
export class Blog {  
    @PrimaryGeneratedColumn()  
    id: number;                // 블로그 ID  

    @Column()  
    author: string;           // 블로그 작성자  

    @Column()  
    title: string;            // 블로그 제목  

    @Column()  
    contents: string;         // 블로그 내용  

    @Column({  
        type: 'enum',  
        enum: BlogStatus,  
        default: BlogStatus.PUBLIC // 기본값 설정  
    })  
    status: BlogStatus;       // 블로그 상태 (PUBLIC, PRIVATE 등)  

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })  
    createdAt: Date;          // 블로그 작성 날짜  

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })  
    updatedAt: Date;          // 블로그 수정 날짜  

    @OneToMany(() => Comment, comment => comment.blog, { cascade: true }) // 댓글과의 관계 설정 및 cascade 추가  
    comments: Comment[];      // 댓글 배열  
}