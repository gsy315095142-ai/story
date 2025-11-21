import { Book, Chapter } from '../types';

const STORAGE_KEY = 'novelcraft_data_v1';

const defaultBook: Book = {
  id: 'default-book',
  title: '未命名小说',
  premise: '这里是一段关于这本小说的核心构思、世界观设定或者主要冲突的描述...',
  style: '通俗小说，节奏明快',
  characters: '主角：待定\n配角：待定',
  chapters: [],
  lastActiveChapterId: null,
};

export const loadBook = (): Book => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse saved book", e);
      return defaultBook;
    }
  }
  return defaultBook;
};

export const saveBook = (book: Book): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
};

export const createChapter = (): Chapter => {
  return {
    id: crypto.randomUUID(),
    title: '新章节',
    content: '',
    summary: null,
    lastModified: Date.now(),
  };
};