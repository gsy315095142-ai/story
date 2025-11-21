import React from 'react';
import { Book } from '../types';
import { SaveIcon } from './Icons';

interface BookSettingsProps {
  book: Book;
  onUpdateBook: (updates: Partial<Book>) => void;
}

const BookSettings: React.FC<BookSettingsProps> = ({ book, onUpdateBook }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900">小说设定</h2>
          <p className="text-gray-500 mt-1">这些设定将作为 AI 生成内容的全局指导原则。</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">小说标题</label>
            <input
              type="text"
              value={book.title}
              onChange={(e) => onUpdateBook({ title: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="输入小说标题"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              核心构思 & 世界观
              <span className="ml-2 text-xs font-normal text-gray-400">AI 将参考这些内容保持故事连贯性</span>
            </label>
            <textarea
              value={book.premise}
              onChange={(e) => onUpdateBook({ premise: e.target.value })}
              rows={6}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="例如：这是一个赛博朋克背景下的侦探故事，主要讲述了..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">人物设定</label>
              <textarea
                value={book.characters}
                onChange={(e) => onUpdateBook({ characters: e.target.value })}
                rows={5}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="主角：性格冷酷，擅长黑客技术..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">文风/基调</label>
              <textarea
                value={book.style}
                onChange={(e) => onUpdateBook({ style: e.target.value })}
                rows={5}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="例如：悬疑、快节奏、幽默..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
             <div className="flex items-center text-green-600 text-sm gap-2">
                <SaveIcon className="w-4 h-4" />
                <span>自动保存中</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSettings;