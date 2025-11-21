import React from 'react';
import { Book, Chapter, AppView } from '../types';
import { PlusIcon, TrashIcon, SettingsIcon, BookIcon } from './Icons';

interface SidebarProps {
  book: Book;
  currentChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onCreateChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onChangeView: (view: AppView) => void;
  currentView: AppView;
}

const Sidebar: React.FC<SidebarProps> = ({
  book,
  currentChapterId,
  onSelectChapter,
  onCreateChapter,
  onDeleteChapter,
  onChangeView,
  currentView,
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      {/* App Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 text-indigo-700">
        <BookIcon className="w-6 h-6" />
        <h1 className="font-bold text-lg tracking-tight font-serif">NovelCraft</h1>
      </div>

      {/* Book Info Card */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-gray-800 truncate pr-2" title={book.title}>
            {book.title}
          </h2>
          <button 
            onClick={() => onChangeView(AppView.SETTINGS)}
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${currentView === AppView.SETTINGS ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
            title="小说设定"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{book.premise}</p>
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          章节列表 ({book.chapters.length})
        </div>
        
        {book.chapters.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm italic">
            暂无章节<br/>点击下方按钮开始创作
          </div>
        )}

        {book.chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            onClick={() => onSelectChapter(chapter.id)}
            className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
              currentChapterId === chapter.id && currentView === AppView.EDITOR
                ? 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm'
                : 'hover:bg-gray-50 text-gray-700 hover:border-gray-200'
            }`}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {chapter.title || `Chapter ${index + 1}`}
              </span>
              <span className="text-[10px] opacity-60 truncate">
                 {new Date(chapter.lastModified).toLocaleDateString()} · {chapter.content.length} 字
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(confirm('确定要删除这一章吗？')) onDeleteChapter(chapter.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-all"
              title="删除"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onCreateChapter}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 font-medium text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          新建章节
        </button>
      </div>
    </div>
  );
};

export default Sidebar;