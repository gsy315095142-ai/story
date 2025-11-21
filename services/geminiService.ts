import { GoogleGenAI } from "@google/genai";
import { Book, Chapter } from '../types';

// Using gemini-3-pro-preview for high quality creative writing as per guidelines
const MODEL_NAME = 'gemini-3-pro-preview';

export const generateStorySegment = async (
  book: Book,
  userPrompt: string,
  targetWordCount: number
): Promise<string> => {
  // Fix: Use process.env.API_KEY directly in initialization as per guidelines.
  // Note: process.env.API_KEY is replaced by string literal during build via vite config.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Context Construction
  // 1. Global Book Context
  const globalContext = `
  你是一个专业的小说家。请根据以下设定续写小说。
  
  【小说标题】：${book.title}
  【核心梗概/世界观】：${book.premise}
  【人物设定】：${book.characters}
  【文风要求】：${book.style}
  `;

  // 2. Recent Context (Last 3 chapters to maintain immediate continuity)
  // We take the raw text of the last few chapters to ensure flow.
  // If text is too long, we might truncate, but Gemini 1.5/Pro context window is large enough for this.
  const recentChapters = book.chapters.slice(-3);
  let storyContext = "";
  
  if (recentChapters.length > 0) {
    storyContext = "\n【前情提要 (最近章节内容)】：\n";
    recentChapters.forEach((chap, index) => {
      storyContext += `--- 章节：${chap.title} ---\n${chap.content.slice(-3000)}\n`; // Taking last 3000 chars of each to be safe but informative
    });
  } else {
    storyContext = "\n【当前为该小说的第一章】\n";
  }

  // 3. The Request
  const requestPrompt = `
  ${globalContext}

  ${storyContext}

  【本次写作任务】：
  请根据以上背景和前情，撰写接下来的剧情。
  用户的具体指引：${userPrompt}
  
  要求：
  1. 字数大约在 ${targetWordCount} 字左右。
  2. 严格贴合设定，保持人物性格一致。
  3. 承接上文剧情，不要重复之前的内容。
  4. 直接输出小说正文，不要包含任何"好的，这是为您生成的小说"之类的开场白或结束语。
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: requestPrompt,
      config: {
        // Using a bit higher temperature for creativity
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        thinkingConfig: { thinkingBudget: 2048 } // Enable some thinking for plot consistency
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};