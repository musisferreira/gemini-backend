import { IsString, IsNotEmpty, IsArray, IsOptional, IsUUID } from 'class-validator';


export class ChatPromptDto{
    @IsString()
    @IsNotEmpty()
    prompt: string;
    @IsArray()
    @IsOptional()
    files: Express.Multer.File[];
    @IsUUID()
    chatId: string;
}
