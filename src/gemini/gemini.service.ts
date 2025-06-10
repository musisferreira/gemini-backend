import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GoogleGenAI } from "@google/genai";
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';
import { ChatPromptDto } from './dtos/chat-prompt.dto';


@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_APK });

   async basicPrompt(basicPromptDto: BasicPromptDto){
        return  basicPromptUseCase(this.ai, basicPromptDto);
        }

    async basicPromptStream(basicPromptDto: BasicPromptDto){

            return basicPromptStreamUseCase(this.ai, basicPromptDto);
            }


        async chatStream(chatPromptDto: ChatPromptDto){
            return chatPromptStreamUseCase(this.ai, chatPromptDto);
            }

    }
