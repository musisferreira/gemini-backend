import { GoogleGenAI, createPartFromUri, createUserContent } from "@google/genai";
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

        //const files = basicPromptDto.files;
        const { prompt, files = [] } = basicPromptDto;
        //const firstImage = files[0]!;
//         const image = await ai.files.upload({
//                 file: new Blob([firstImage.buffer], { type: firstImage.mimetype }),
//             });


        const image = await Promise.all(
            files.map( (file) => {
                 return ai.files.upload({
                                file: new Blob([file.buffer],
                                    { type: file.mimetype.includes('image')
                                        ? file.mimetype : 'image/jpg', }),
                            });
                }),

        );


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