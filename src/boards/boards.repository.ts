import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createPool, Pool } from "mysql2/promise";
import { databaseConfig } from "../configs/database.config";
import { error } from "console";
import { Board } from "./boards.entity";
import { query } from "express";

@Injectable()
export class BoardsRepository {
    private connectPool: Pool


    constructor() {
        this.connectPool = createPool(databaseConfig);
        this.connectPool.getConnection()
            .then(() => console.log('DB Connected'))
            .catch(err => console.error('DB connection faild', err));
    }

    // 게시글 조회관련 데이터 엑세스
    async findAll(): Promise<Board[]> {
        const selectQuery = `SELECT * FROM board`;
        try {
            const [result] = await this.connectPool.query(selectQuery)
            return result as Board[]
        } catch (err) {
            throw new InternalServerErrorException('Database query failed', err);
        }
    }

    // 게시글 작성관련 데이터 엑세스 
    async saveBoard(board: Board) {
        const insertQuery = `INSERT INTO board(author,title,contents,status) VALUES (?,?,?,?)`;
        try {
            const result = await this.connectPool.query(insertQuery, [board.author, board.title, board.contents, board.status])
            const message = "Created success!"
            return message;
        } catch (err) {
            throw new InternalServerErrorException('Database query failed', err);
        }
    }
}