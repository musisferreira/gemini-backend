import {
    Body,
    Controller ,
     Res,
      HttpStatus,
      Post,
      UseInterceptors,
       UploadedFiles,
        } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('basic-prompt')
  @UseInterceptors(FilesInterceptor('files'))
   basicPrompt(@Body() basicPromptDto: BasicPromptDto){
        return this.geminiService.basicPrompt(basicPromptDto);
      }



   @Post('basic-prompt-stream')
    async basicPromptStream(
         @Body() basicPromptDto: BasicPromptDto,
         @Res() res: Response,
         @UploadedFiles() files: Express.Multer.File,
         // TODO: files.
     ){
         console.log(files);
         const stream = await this.geminiService.basicPromptStream(basicPromptDto);
         //res.setHeader('Content-Type', 'application/json');
         res.setHeader('Content-Type', 'text/plain');
         res.status(HttpStatus.OK);

         for await (const chunk of stream){

             const piece = chunk.text;
             console.log(piece);
             res.write(piece);
             }

         res.end();

        }

}
