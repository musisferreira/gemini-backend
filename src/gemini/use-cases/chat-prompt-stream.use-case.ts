import { GoogleGenAI, createPartFromUri, Content } from "@google/genai";
import { ChatPromptDto } from '../dtos/chat-prompt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-file';




interface Options{
    model?: string;
    systemInstruction?: string;
    history: Content[];
    }

export const chatPromptStreamUseCase = async (
    ai: GoogleGenAI,
    chatPromptDto: ChatPromptDto,
    options?: Options,
    ) => {
        const { prompt, files = [] } = chatPromptDto;
        const uploadedFiles = await geminiUploadFiles(ai, files);



        const {
            model = 'gemini-2.0-flash',
            history = [],
            systemInstruction = `responde unicamente en espanol,
                  en formato markdown.
                  Usa negritas de esta forma __
                  Usa el sistema métrico decimal de España.
                  `,
                } = options ?? {};

            const chat = await ai.chats.create({
                model: model,
                config: {
                    systemInstruction: systemInstruction,
                    },
                history: history,
                });
            return chat.sendMessageStream({
                message: [prompt,
                    ...uploadedFiles.map((file) =>
                    createPartFromUri(file.uri ?? '', file.mimeType ?? ''))],
                })
    };