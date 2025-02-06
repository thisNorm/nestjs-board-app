import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { Article } from './article.entity';
import { ArticleStatus } from './article-status.enum';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name)

    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>
    ) { }

    // CREATE
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, loginedUser: User): Promise<Article> {
        this.logger.verbose(`User: ${loginedUser.username} is creating a new article with title: ${createArticleRequestDto.title}`);

        const { title, contents } = createArticleRequestDto;

        if (!title || !contents) {
            throw new BadRequestException(`제목, 그리고 내용을 모두 입력해야 합니다.`);
        }
        const newArticle: Article = this.articleRepository.create({
            author: loginedUser.username,
            title,
            contents,
            status: ArticleStatus.PUBLIC,
            user: loginedUser
        });

        const createArticle = await this.articleRepository.save(newArticle);

        this.logger.verbose(`Article title with ${createArticle.title} created Successfully`);
        return createArticle;
    }

    // READ - all
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose(`Retrieving all Articles`);

        const foundArticles = await this.articleRepository.find();

        this.logger.verbose(`Retrieved all articles list Successfully`);
        return foundArticles;
    }

    // READ - by Loggined User
    async getMyAllArticles(loginedUser: User): Promise<Article[]> {
        this.logger.verbose(`Retrieving ${loginedUser.username}'s all articles`);

        const foundArticles = await this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .getMany();

        this.logger.verbose(`Retrieved ${loginedUser.username}'s all articles list Successfully`);
        return foundArticles;
    }

    // READ - by id 
    async getArticleDetailById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieved a article by id: ${id}`);

        const foundArticle = await this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .where('article.id = :id', { id })
            .getOne();

        if (!foundArticle) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }

        this.logger.verbose(`Retrieved a article by ${id} details Successfully`);
        return foundArticle;
    }

    // READ - by keyword
    async getArticlesByKeyword(author: string): Promise<Article[]> {
        this.logger.verbose(`Retrieved a article by author: ${author}`);

        if (!author) {
            throw new BadRequestException(`작성자를 입력해야 합니다.`);
        }
        const foundArticles = await this.articleRepository.findBy({ author: author });
        if (foundArticles.length === 0) {
            throw new NotFoundException(`작성자 ${author}의 게시글을 찾을 수 없습니다.`);
        }

        this.logger.verbose(`Retrieved articles list by ${author} Successfully`);
        return foundArticles;
    }

    // UPDATE - by id 
    async updateArticleById(id: number, updateArticleRequestDto: UpdateArticleRequestDto): Promise<Article> {
        this.logger.verbose(`Updating a article by id: ${id} with updateArticleRequestDto`);

        const foundArticle = await this.getArticleDetailById(id);
        const { title, contents } = updateArticleRequestDto;
        if (!title || !contents) {
            throw new BadRequestException('제목과 내용을 모두 입력해야 합니다.');
        }
        foundArticle.title = title;
        foundArticle.contents = contents;
        const updatedArticle = await this.articleRepository.save(foundArticle);

        this.logger.verbose(`Updated a article by ${id} Successfully`);
        return updatedArticle;
    }

    // UPDATE - status <ADMIN> 
    async updateArticleStatusById(id: number, status: ArticleStatus): Promise<void> {
        this.logger.verbose(`ADMIN is Updating a article by id: ${id} with status: ${status}`);

        const result = await this.articleRepository.update(id, { status }); // 게시글 존재 여부 확인  
        if (result.affected === 0) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }

        this.logger.verbose(`Updated a article's by ${id} stauts to ${status} Successfully`);
    }

    // DELETE - by id
    async deleteArticleById(id: number, loginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${loginedUser.username} is Deleting a article by id: ${id}`);

        const foundArticle = await this.getArticleDetailById(id);

        if (foundArticle.user.id !== loginedUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this article')
        }

        this.logger.verbose(`Deleted a article by id: ${id} Successfully`);
        await this.articleRepository.delete(foundArticle);
    }
}