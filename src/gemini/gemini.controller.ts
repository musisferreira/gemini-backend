import { GenerateContentResponse } from '@google/genai';
import {
    Body,
    Controller ,
     Res,
      HttpStatus,
      Post,
      UseInterceptors,
       UploadedFiles,
       Get,
       Param,

        } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { BasicPromptDto, } from './dtos/basic-prompt.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ChatPromptDto } from './dtos/chat-prompt.dto';




@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(res: Response, stream: AsyncGenerator<GenerateContentResponse, any, any>){

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
       void this.outputStreamResponse(res,stream);

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
             const stream = await this.geminiService.chatStream(chatPromptDto);
             const data = await this.outputStreamResponse(res, stream);

             const geminiMessage = {
                 role: 'model',
                 parts: [{ text: data }],
                 };

             const userMessage = {
                 role: 'user',
                 parts: [{ text: chatPromptDto.prompt }],
                    };

                this.geminiService.saveMessage(chatPromptDto.chatId, userMessage);
                this.geminiService.saveMessage(chatPromptDto.chatId, geminiMessage);


            }

        @Get('chat-history/:chatId')
        getChatHistory(@Param('chatId') chatId: string){
            return this.geminiService.getChatHistory(chatId).map((message) => ({
                    role: message.role,
                    parts: message.parts?.map(part => part.text).join(''),
                }));
            }


}
