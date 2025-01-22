import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.to';

@Injectable()
export class BoardsService {
    // 데이터 베이스 
    private boards: Board[] = [];
    
    // 게시글 조회 기능
    getAllBoards(): Board[] {
        return this.boards;
    }

    // 특정 게시글 조회 기능
    getBoardDetailById(id: number): Board {
        const foundBoard = this.boards.find((board) => board.id == id)
        if(!foundBoard) {
            throw new NotFoundException(`Board with ID ${id} not found`);
        }
        return foundBoard;
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능
    getBoardsByKeyword(author: string): Board[] {
        return this.boards.filter((board) => board.author === author)
    }

    // 게시글 작성 기능
    createBoard(createBoardDto: CreateBoardDto) {
        const {author, title, contents} = createBoardDto;

        const board: Board = {
            id: this.boards.length + 1, // 임시 Auto Increament 기능
            author,
            title,
            contents,
            status: BoardStatus.PUBLIC
        }
        const saveBoard = this.boards.push(board);
        return saveBoard;
    }

    // 특정 번호의 게시글 수정
    updateBoardById(id: number, updateboardDto: UpdateBoardDto): Board {
        const foundBoard = this.getBoardDetailById(id);
        const {title, contents} = updateboardDto;
        
        foundBoard.title = title;
        foundBoard.contents = contents;

        return foundBoard;
    }

    // 특정 번호의 게시글 일부 수정
    updateBoardStatusById(id: number, status: BoardStatus): Board {
        const foundBoard = this.getBoardDetailById(id);
        foundBoard.status = status;
        return foundBoard;
        
    }


    deleteBoardById(id: number): void {
        this.boards = this.boards.filter((board) => board.id != id);
    }
}
