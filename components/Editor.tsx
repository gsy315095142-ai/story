import React, { useState, useEffect, useRef } from 'react';
import { Book, Chapter } from '../types';
import { SparklesIcon, WandIcon } from './Icons';
import { generateStorySegment } from '../services/geminiService';

interface EditorProps {
  book: Book;
  chapter: Chapter;
  onUpdateChapter: (id: string, updates: Partial<Chapter>) => void;
}

const Editor: React.FC<EditorProps> = ({ book, chapter, onUpdateChapter }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [wordCount, setWordCount] = useState(500);
  const [showAiPanel, setShowAiPanel] = useState(true); // Default open
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const generatedText = await generateStorySegment(book, prompt, wordCount);
      
      // Append the new text with a newline if needed
      const newContent = chapter.content 
        ? `${chapter.content}\n\n${generatedText}` 
        : generatedText;

      onUpdateChapter(chapter.id, { content: newContent });
      setPrompt(''); // Clear prompt after success
      
      // Scroll to bottom
      if(textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }

    } catch (error) {
      alert("生成失败，请检查网络或 API Key 设置。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-white relative overflow-hidden">
      
      {/* Editor Header */}
      <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onUpdateChapter(chapter.id, { title: e.target.value })}
          className="text-xl font-serif font-bold text-gray-800 border-none outline-none w-full placeholder-gray-300 bg-transparent"
          placeholder="输入章节标题..."
        />
        <button
          onClick={() => setShowAiPanel(!showAiPanel)}
          className={`ml-4 p-2 rounded-full transition-all ${showAiPanel ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          title="Toggle AI Assistant"
        >
          <SparklesIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Writing Area */}
        <div className="flex-1 h-full overflow-hidden relative">
            <textarea
              ref={textareaRef}
              value={chapter.content}
              onChange={(e) => onUpdateChapter(chapter.id, { content: e.target.value })}
              className="w-full h-full resize-none p-8 md:px-16 lg:px-24 outline-none font-serif text-lg leading-loose text-gray-800 bg-paper placeholder-gray-300 selection:bg-indigo-100"
              placeholder="在此处开始写作，或使用右侧 AI 助手生成内容..."
            />
        </div>

        {/* AI Assistant Sidebar (Right Panel) */}
        <div 
            className={`w-80 bg-white border-l border-gray-100 flex flex-col transition-all duration-300 transform ${showAiPanel ? 'translate-x-0' : 'translate-x-full w-0 border-none'}`}
        >
          <div className="p-5 flex flex-col h-full bg-gray-50/50">
            <div className="flex items-center gap-2 mb-4 text-indigo-700">
              <WandIcon className="w-5 h-5" />
              <h3 className="font-semibold">AI 写作助手</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                        情节指示
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="告诉 AI 接下来的剧情发展，例如：主角发现了一个神秘的地下室，里面藏着..."
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32 shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                        目标字数: {wordCount}
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={wordCount}
                        onChange={(e) => setWordCount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>100字</span>
                        <span>2000字</span>
                    </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-800 mb-1">Context Aware</h4>
                    <p className="text-xs text-blue-600 leading-relaxed">
                        AI 会自动阅读前 3 章的内容以及您的小说全局设定，确保生成内容连贯。
                    </p>
                </div>
            </div>

            <div className="pt-4 mt-auto">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className={`w-full py-3 rounded-lg font-medium shadow-md flex items-center justify-center gap-2 transition-all
                        ${isGenerating || !prompt.trim() 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg active:scale-95'
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>构思生成中...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-4 h-4" />
                            <span>生成续写</span>
                        </>
                    )}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;