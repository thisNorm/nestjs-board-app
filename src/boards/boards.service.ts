import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/auth/users.entity';

@Injectable()
export class BoardsService {
    private readonly logger = new Logger(BoardsService.name)

    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ) { }

    // 게시글 작성 기능
    async createBoard(createBoardDto: CreateBoardDto, loginedUser: User): Promise<Board> {
        this.logger.verbose(`User: ${loginedUser.username} is creating a new board with title: ${createBoardDto.title}`);

        const { title, contents } = createBoardDto;

        if (!title || !contents) {
            throw new BadRequestException(`제목, 그리고 내용을 모두 입력해야 합니다.`);
        }
        const newBoard: Board = this.boardRepository.create({
            author: loginedUser.username,
            title,
            contents,
            status: BoardStatus.PUBLIC,
            user: loginedUser
        });

        const createBoard = await this.boardRepository.save(newBoard);

        this.logger.verbose(`Board title with ${createBoard.title} created Successfully`);
        return createBoard;
    }

    // 게시글 조회 기능  
    async getAllBoards(): Promise<Board[]> {
        this.logger.verbose(`Retrieving all Boards`);

        const foundBoards = await this.boardRepository.find();

        this.logger.verbose(`Retrieved all boards list Successfully`);
        return foundBoards;
    }

    // 로그인된 유저의 게시글 조회 기능  
    async getMyAllBoards(loginedUser: User): Promise<Board[]> {
        this.logger.verbose(`Retrieving ${loginedUser.username}'s all boards`);

        const foundBoards = await this.boardRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .getMany();

        this.logger.verbose(`Retrieved ${loginedUser.username}'s all boards list Successfully`);
        return foundBoards;
    }

    // 특정 게시글 조회 기능  
    async getBoardDetailById(id: number): Promise<Board> {
        this.logger.verbose(`Retrieved a board by id: ${id}`);

        const foundBoard = await this.boardRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .where('board.id = :id', { id })
            .getOne();

        if (!foundBoard) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }

        this.logger.verbose(`Retrieved a board by ${id} details Successfully`);
        return foundBoard;
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능  
    async getBoardsByKeyword(author: string): Promise<Board[]> {
        this.logger.verbose(`Retrieved a board by author: ${author}`);

        if (!author) {
            throw new BadRequestException(`작성자를 입력해야 합니다.`);
        }
        const foundBoards = await this.boardRepository.findBy({ author: author });
        if (foundBoards.length === 0) {
            throw new NotFoundException(`작성자 ${author}의 게시글을 찾을 수 없습니다.`);
        }

        this.logger.verbose(`Retrieved boards list by ${author} Successfully`);
        return foundBoards;
    }

    // 특정 번호의 게시글 수정  
    async updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
        this.logger.verbose(`Updating a board by id: ${id} with updateBoardDto`);

        const foundBoard = await this.getBoardDetailById(id); 
        const { title, contents } = updateBoardDto;
        if (!title || !contents) {
            throw new BadRequestException('제목과 내용을 모두 입력해야 합니다.');
        }
        foundBoard.title = title;
        foundBoard.contents = contents;
        const updatedBoard = await this.boardRepository.save(foundBoard);

        this.logger.verbose(`Updated a board by ${id} Successfully`);
        return updatedBoard;
    }

    // 특정 번호의 게시글 일부 수정  
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {
        this.logger.verbose(`ADMIN is Updating a board by id: ${id} with status: ${status}`);

        const result = await this.boardRepository.update(id, { status }); // 게시글 존재 여부 확인  
        if (result.affected === 0) {
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
        }

        this.logger.verbose(`Updated a board's by ${id} stauts to ${status} Successfully`);
    }

    // 게시글 삭제 기능  
    async deleteBoardById(id: number, loginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${loginedUser.username} is Deleting a board by id: ${id}`);

        const foundBoard = await this.getBoardDetailById(id);

        if (foundBoard.user.id !== loginedUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this board')
        }

        this.logger.verbose(`Deleted a board by id: ${id} Successfully`);
        await this.boardRepository.delete(foundBoard);
    }
}