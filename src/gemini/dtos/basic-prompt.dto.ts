
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';


export class BasicPromptDto {
    @IsString()
    @IsNotEmpty()
    prompt: string;
    }