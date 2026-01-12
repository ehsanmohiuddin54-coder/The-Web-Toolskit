
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { getBlogBySlug } from '../utils/blog-store';
import { getCommentsByBlog, addComment, deleteComment } from '../utils/comment-store';
import { useAuth } from '../components/AuthContext';
import { BlogComment } from '../types';

export const BlogPostView: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const blog = getBlogBySlug(slug || '');
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (blog) {
      setComments(getCommentsByBlog(blog.id));
    }
  }, [blog, slug]);

  if (!blog) return <Navigate to="/blog" replace />;

  const handlePostComment = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!user) return;
    
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    addComment(blog.id, user.id, user.name, content, parentId);
    
    if (parentId) {
      setReplyContent('');
      setReplyToId(null);
    } else {
      setNewComment('');
    }
    
    setComments(getCommentsByBlog(blog.id));
  };

  const handleDeleteComment = (id: string) => {
    if (isAdmin || confirm('Delete this comment?')) {
      deleteComment(id);
      setComments(getCommentsByBlog(blog.id));
    }
  };

  const CommentItem: React.FC<{ comment: BlogComment; isReply?: boolean }> = ({ comment, isReply }) => {
    const replies = comments.filter(c => c.parentId === comment.id);
    
    return (
      <div className={`space-y-4 ${isReply ? 'ml-8 md:ml-12 border-l-2 border-slate-100 pl-6 md:pl-8' : ''}`}>
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm relative group hover:border-blue-100 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black uppercase ${isReply ? 'bg-indigo-50 text-indigo-400' : 'bg-slate-100 text-slate-400'}`}>
                {comment.userName[0]}
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">{comment.userName}</div>
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{comment.date}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isReply && user && (
                <button 
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                  className="text-[10px] uppercase font-black tracking-widest text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1 rounded-lg"
                >
                  {replyToId === comment.id ? 'Cancel' : 'Reply'}
                </button>
              )}
              {(isAdmin || (user && user.id === comment.userId)) && (
                <button 
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          <p className="text-slate-600 text-base leading-relaxed">{comment.content}</p>

          {/* Inline Reply Form */}
          {replyToId === comment.id && (
            <form onSubmit={(e) => handlePostComment(e, comment.id)} className="mt-6 pt-6 border-t border-slate-50 animate-in slide-in-from-top-2">
              <textarea
                required
                autoFocus
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder={`Replying to ${comment.userName}...`}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none mb-3 text-sm"
                rows={2}
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setReplyToId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs shadow-md hover:bg-blue-700 transition-all"
                >
                  Post Reply
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Render Nested Replies */}
        {replies.length > 0 && (
          <div className="space-y-4">
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    );
  };

  const rootComments = comments.filter(c => !c.parentId);

  return (
    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button 
        onClick={() => navigate('/blog')}
        className="inline-flex items-center text-sm font-bold text-blue-600 mb-8 hover:-translate-x-1 transition-transform group"
      >
        <span className="mr-2">←</span> Back to All Blogs
      </button>

      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{blog.category}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="text-sm text-slate-500">{blog.date}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
          {blog.title}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
            {blog.author[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{blog.author}</p>
            <p className="text-xs text-slate-400">Verified Author • SEO Specialist</p>
          </div>
        </div>
      </header>

      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 h-[300px] md:h-[500px] border border-slate-100">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
      </div>

      <div className="prose prose-slate prose-lg max-w-none mb-16">
        <p className="text-2xl text-slate-600 font-semibold mb-12 italic border-l-4 border-blue-600 pl-6 bg-slate-50/50 py-4 rounded-r-2xl">
          {blog.summary}
        </p>
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
          {blog.content}
        </div>
      </div>

      {/* Explore Tools Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-100 mb-16">
        <div className="max-w-md">
          <h4 className="text-2xl md:text-3xl font-black mb-3 italic">Optimize Your Writing</h4>
          <p className="text-blue-100 opacity-90 text-sm md:text-base leading-relaxed">
            Use our professional SEO utilities to count words, check keyword density, and generate meta tags just like this article!
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl whitespace-nowrap shadow-lg hover:scale-105 transition-transform"
        >
          Explore All Tools
        </button>
      </div>

      {/* Comment Section */}
      <section className="mt-16 pt-16 border-t border-slate-200">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl font-black text-slate-900">Discussion <span className="text-blue-600">({comments.length})</span></h3>
        </div>
        
        {user ? (
          <form onSubmit={(e) => handlePostComment(e)} className="mb-12 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <textarea
              required
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Start a new conversation..."
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none mb-4 text-slate-700"
              rows={3}
            ></textarea>
            <div className="flex justify-end">
              <button type="submit" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all">
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-12 p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-slate-700 font-bold text-xl mb-6">Join the conversation</p>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Please sign in to share your thoughts and interact with our growing community.</p>
            <button 
              onClick={() => navigate('/login', { state: { from: location } })} 
              className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Sign In to Comment
            </button>
          </div>
        )}

        <div className="space-y-10">
          {rootComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          {rootComments.length === 0 && (
            <div className="py-12 text-center text-slate-300">
               <div className="text-5xl mb-4 opacity-20">🍃</div>
               <p className="italic font-medium">No comments yet. Be the first to start the discussion!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Navigation Escape Paths */}
      <footer className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <button 
          onClick={() => navigate('/blog')}
          className="w-full md:w-auto px-8 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center"
        >
          ← Back to Blog List
        </button>
        <div className="flex flex-wrap gap-2 justify-center">
          {blog.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">#{tag}</span>
          ))}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center"
        >
          Back to Tools Dashboard
        </button>
      </footer>
    </article>
  );
};
