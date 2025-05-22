import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from '../dtos/basic-prompt.dto';



interface Options{
    model?: string;
    systemInstruction?: string;
    }

export const basicPromptStreamUseCase = async (
    ai: GoogleGenAI,
    basicPromptDto: BasicPromptDto,
    options?: Options,
    ) => {
        const { model = 'gemini-2.0-flash',
                systemInstruction = `responde unicamente en espanol,
                  en formato markdown.
                  Usa negritas de esta forma __
                  Usa el sistema métrico decimal de España.
                  `,
                } = options ?? {};
        const response = await ai.models.generateContentStream({
                model: model,
                contents: basicPromptDto.prompt,
                config:{
                    systemInstruction:systemInstruction,

                    }
              });
            return response;
    };