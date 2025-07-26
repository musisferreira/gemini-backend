import { GoogleGenAI, createPartFromUri, createUserContent } from "@google/genai";
import { BasicPromptDto } from '../dtos/basic-prompt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-file';

interface Options{
    model?: string;
    systemInstruction?: string;
    }

export const basicPromptStreamUseCase = async (
    ai: GoogleGenAI,
    basicPromptDto: BasicPromptDto,
    options?: Options,
    ) => {
        const { prompt, files = [] } = basicPromptDto;

        const image = await geminiUploadFiles(ai, files);

        const { model = 'gemini-2.0-flash',
                systemInstruction = `responde unicamente en espanol,
                  en formato markdown.
                  Usa negritas de esta forma __
                  Usa el sistema métrico decimal de España.
                  `,
                } = options ?? {};
        const response = await ai.models.generateContentStream({
                model: model,
                //contents: basicPromptDto.prompt,
                contents: [
                    createUserContent([
                        prompt,
                        // imágenes ou archivos
                       // createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
                        ...image.map((image) => createPartFromUri(image.uri!, image.mimeType!)),

                        ])
                    ],
                config:{
                    systemInstruction:systemInstruction,

                    }
              });
            return response;
    };