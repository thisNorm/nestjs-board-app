import { BoardStatus } from "./boards-status.enum";

export class Board {
    id: number;
    author: string;
    title: string;
    content: string;
    status: BoardStatus
}