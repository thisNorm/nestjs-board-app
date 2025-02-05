import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}