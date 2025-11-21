import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import BookSettings from './components/BookSettings';
import { loadBook, saveBook, createChapter } from './services/storageService';
import { Book, Chapter, AppView } from './types';

function App() {
  const [book, setBook] = useState<Book>(loadBook());
  const [currentView, setCurrentView] = useState<AppView>(AppView.SETTINGS);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  // Load initial state logic
  useEffect(() => {
    if (book.chapters.length > 0) {
      // If we have chapters, default to the last active one or the first one
      const targetId = book.lastActiveChapterId || book.chapters[0].id;
      setCurrentChapterId(targetId);
      setCurrentView(AppView.EDITOR);
    } else {
      // No chapters, show settings to setup book
      setCurrentView(AppView.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save whenever book changes
  useEffect(() => {
    saveBook(book);
  }, [book]);

  // Track last active chapter
  useEffect(() => {
    if (currentChapterId && currentView === AppView.EDITOR) {
      setBook(prev => ({ ...prev, lastActiveChapterId: currentChapterId }));
    }
  }, [currentChapterId, currentView]);

  const handleCreateChapter = () => {
    const newChapter = createChapter();
    const chapterCount = book.chapters.length + 1;
    newChapter.title = `第 ${chapterCount} 章`;
    
    setBook((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
    setCurrentChapterId(newChapter.id);
    setCurrentView(AppView.EDITOR);
  };

  const handleUpdateChapter = (id: string, updates: Partial<Chapter>) => {
    setBook((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) =>
        ch.id === id ? { ...ch, ...updates, lastModified: Date.now() } : ch
      ),
    }));
  };

  const handleDeleteChapter = (id: string) => {
    setBook((prev) => {
      const newChapters = prev.chapters.filter((ch) => ch.id !== id);
      return { ...prev, chapters: newChapters };
    });
    if (currentChapterId === id) {
      setCurrentChapterId(null);
      setCurrentView(AppView.SETTINGS); // Fallback view
    }
  };

  const handleUpdateBook = (updates: Partial<Book>) => {
    setBook((prev) => ({ ...prev, ...updates }));
  };

  const activeChapter = book.chapters.find(c => c.id === currentChapterId);

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
      <Sidebar
        book={book}
        currentChapterId={currentChapterId}
        onSelectChapter={(id) => {
          setCurrentChapterId(id);
          setCurrentView(AppView.EDITOR);
        }}
        onCreateChapter={handleCreateChapter}
        onDeleteChapter={handleDeleteChapter}
        onChangeView={setCurrentView}
        currentView={currentView}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white h-full">
        {currentView === AppView.SETTINGS ? (
          <BookSettings book={book} onUpdateBook={handleUpdateBook} />
        ) : (
          activeChapter ? (
            <Editor
              book={book}
              chapter={activeChapter}
              onUpdateChapter={handleUpdateChapter}
            />
          ) : (
             <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
               <div className="text-center">
                 <p className="mb-4">请选择或创建一个章节</p>
                 <button onClick={handleCreateChapter} className="text-indigo-600 font-medium hover:underline">
                    立即创建
                 </button>
               </div>
             </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;