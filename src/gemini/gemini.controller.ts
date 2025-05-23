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
import { BasicPromptDto, chatPromptDto } from './dtos/basic-prompt.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GeneratorContentResponse } from '@google/genai';
import { ChatPromptDto } from './dtos/chat-prompt.dto';


@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  outputStreamResponse(res: Response, stream: AsyncGenerator<GeneratorContentResponse, any, any>)async{

              //const stream = await this.geminiService.basicPromptStream(basicPromptDto);
             //res.setHeader('Content-Type', 'application/json');
             res.setHeader('Content-Type', 'text/plain');
             res.status(HttpStatus.OK);

             let resultText = '';
             for await (const chunk of stream){

                 const piece = chunk.text;
                 resultText += piece;
                 res.write(piece);
                 }

             res.end();
             return resultText;


      }



  @Post('basic-prompt')

   basicPrompt(@Body() basicPromptDto: BasicPromptDto){
        return this.geminiService.basicPrompt(basicPromptDto);
      }



   @Post('basic-prompt-stream')
   @UseInterceptors(FilesInterceptor('files'))
    async basicPromptStream(

         @Body() basicPromptDto: BasicPromptDto,
         @Res() res: Response,
         @UploadedFiles() files: Array<Express.Multer.File>,


         // TODO: files.
     ){
         basicPromptDto.files = files;
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

     @Post('chat-stream')
       @UseInterceptors(FilesInterceptor('files'))
        async chatStream(

             @Body() chatPromptDto: ChatPromptDto,
             @Res() res: Response,
             @UploadedFiles() files: Array<Express.Multer.File>,


             // TODO: files.
         ){
             chatPromptDto.files = files;
             const stream = await this.geminiService.basicPromptStream(chatPromptDto);


             const data = await this.outputStreamResponse(res, stream);
             console.log({data});

            }


}
