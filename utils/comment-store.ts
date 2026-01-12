
import { BlogComment } from '../types';

const COMMENTS_KEY = 'seo_utility_comments';

export const getCommentsByBlog = (blogId: string): BlogComment[] => {
  const all = getAllComments();
  return all.filter(c => c.blogId === blogId);
};

export const getAllComments = (): BlogComment[] => {
  const stored = localStorage.getItem(COMMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addComment = (blogId: string, userId: string, userName: string, content: string, parentId?: string) => {
  const comments = getAllComments();
  const newComment: BlogComment = {
    id: Date.now().toString(),
    blogId,
    userId,
    userName,
    content,
    date: new Date().toLocaleString(),
    parentId
  };
  comments.push(newComment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  return newComment;
};

export const deleteComment = (id: string) => {
  const comments = getAllComments().filter(c => c.id !== id);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

export const updateComment = (id: string, content: string) => {
  const comments = getAllComments();
  const index = comments.findIndex(c => c.id === id);
  if (index > -1) {
    comments[index].content = content;
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }
};
