import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/user/user.entity";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: ArticleStatus

    @ManyToOne(Type => User, user => user.article, { eager: false })
    user: User;
}