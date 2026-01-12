
import React, { useState, useEffect } from 'react';
import { BlogPost, User, BlogComment } from '../types';
import { getBlogs, saveBlog, deleteBlog } from '../utils/blog-store';
import { getAllUsers, deleteUser } from '../utils/auth-store';
import { getAllComments, deleteComment } from '../utils/comment-store';
import { getSettings, toggleTool } from '../utils/settings-store';
import { navItems } from '../App';

type AdminTab = 'blogs' | 'users' | 'comments' | 'tools' | 'editor';

export const BlogAdmin: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('blogs');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'seo' | 'settings'>('content');
  
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    summary: '',
    category: 'SEO',
    tags: [],
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    seoTitle: '',
    seoDescription: '',
    author: 'Admin'
  });

  const refreshData = () => {
    setBlogs(getBlogs());
    setUsers(getAllUsers());
    setComments(getAllComments());
    setEnabledTools(getSettings().enabledTools);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSave = () => {
    if (!form.title || !form.slug) return alert('Title and Slug are required');
    
    // Fixed: Property 'toString' does not exist on type 'never' by avoiding incorrect narrowing from 'as BlogPost' 
    // and using a safer tags processing logic that handles both arrays and potentially string inputs.
    const newBlog: BlogPost = {
      ...form as any,
      id: editingId === 'new' ? Date.now().toString() : (editingId || ''),
      date: form.date || new Date().toISOString().split('T')[0],
      tags: Array.isArray(form.tags) 
        ? form.tags 
        : (typeof form.tags === 'string' ? (form.tags as string).split(',').map(t => t.trim()) : [])
    };
    saveBlog(newBlog);
    setEditingId(null);
    setActiveAdminTab('blogs');
    refreshData();
  };

  const handleEditPost = (blog: BlogPost) => {
    setEditingId(blog.id);
    setForm(blog);
    setActiveAdminTab('editor');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Delete this post?')) {
      deleteBlog(id);
      refreshData();
    }
  };

  const handleToggleTool = (path: string) => {
    toggleTool(path);
    refreshData();
  };

  const autoGenerateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Admin Control Center</h2>
          <p className="text-slate-500">Manage your entire ecosystem from one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           {[
             { id: 'blogs', label: 'Posts', icon: '✍️' },
             { id: 'users', label: 'Users', icon: '👥' },
             { id: 'comments', label: 'Moderation', icon: '💬' },
             { id: 'tools', label: 'Tool Config', icon: '🔧' }
           ].map(tab => (
             <button
                key={tab.id}
                onClick={() => { setActiveAdminTab(tab.id as AdminTab); setEditingId(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${
                  activeAdminTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
             >
               <span>{tab.icon}</span>
               <span>{tab.label}</span>
             </button>
           ))}
        </div>
      </div>

      {activeAdminTab === 'editor' && (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="flex border-b border-slate-50 bg-slate-50/50">
            {['content', 'seo', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveEditorTab(tab as any)}
                className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeEditorTab === tab ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-6">
            {activeEditorTab === 'content' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blog Title</label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value, slug: autoGenerateSlug(e.target.value)})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="e.g. 10 SEO Tips for 2025"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Slug</label>
                  <input 
                    type="text" 
                    value={form.slug}
                    onChange={e => setForm({...form, slug: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="my-cool-blog-post"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Content</label>
                  <textarea 
                    rows={10}
                    value={form.content}
                    onChange={e => setForm({...form, content: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none font-mono text-sm"
                    placeholder="Start writing..."
                  />
                </div>
              </div>
            )}

            {activeEditorTab === 'seo' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SEO Meta Title</label>
                  <input 
                    type="text" 
                    value={form.seoTitle}
                    onChange={e => setForm({...form, seoTitle: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SEO Meta Description</label>
                  <textarea 
                    rows={3}
                    value={form.seoDescription}
                    onChange={e => setForm({...form, seoDescription: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeEditorTab === 'settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Publish Status</label>
                  <select 
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value as any})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                  <input 
                    type="text" 
                    value={form.image}
                    onChange={e => setForm({...form, image: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-between">
            <button onClick={() => setActiveAdminTab('blogs')} className="text-slate-400 hover:text-slate-600 font-bold">Cancel</button>
            <button onClick={handleSave} className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100">Save Changes</button>
          </div>
        </div>
      )}

      {activeAdminTab === 'blogs' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
           <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Content Library</h3>
              <button 
                onClick={() => { setEditingId('new'); setActiveAdminTab('editor'); setForm({ title: '', slug: '', content: '', summary: '', category: 'SEO', tags: [], status: 'draft', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', seoTitle: '', seoDescription: '', author: 'Admin' }); }}
                className="text-xs font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-xl"
              >
                + New Post
              </button>
           </div>
           <table className="w-full text-left">
             <thead className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <tr>
                 <th className="px-8 py-4">Title</th>
                 <th className="px-8 py-4">Status</th>
                 <th className="px-8 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {blogs.map(blog => (
                 <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                   <td className="px-8 py-4 font-bold text-slate-800">{blog.title}</td>
                   <td className="px-8 py-4">
                     <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                       blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                     }`}>
                       {blog.status}
                     </span>
                   </td>
                   <td className="px-8 py-4 text-right space-x-2">
                     <button onClick={() => handleEditPost(blog)} className="text-sm font-bold text-blue-600 hover:underline">Edit</button>
                     <button onClick={() => handleDeletePost(blog.id)} className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
           <table className="w-full text-left">
             <thead className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <tr>
                 <th className="px-8 py-4">User</th>
                 <th className="px-8 py-4">Role</th>
                 <th className="px-8 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {users.map(u => (
                 <tr key={u.id}>
                   <td className="px-8 py-4">
                     <div className="font-bold text-slate-800">{u.name}</div>
                     <div className="text-xs text-slate-400">{u.email}</div>
                   </td>
                   <td className="px-8 py-4">
                     <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">{u.role}</span>
                   </td>
                   <td className="px-8 py-4 text-right">
                      {u.id !== 'admin-1' && (
                        <button 
                          onClick={() => { if(confirm('Remove user?')) { deleteUser(u.id); refreshData(); } }}
                          className="text-red-500 text-sm font-bold hover:underline"
                        >
                          Remove
                        </button>
                      )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {activeAdminTab === 'comments' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
           <table className="w-full text-left">
             <thead className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <tr>
                 <th className="px-8 py-4">Comment</th>
                 <th className="px-8 py-4">Author</th>
                 <th className="px-8 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {comments.map(c => (
                 <tr key={c.id}>
                   <td className="px-8 py-4 max-w-md">
                     <p className="text-sm text-slate-700 italic">"{c.content}"</p>
                   </td>
                   <td className="px-8 py-4">
                     <div className="text-sm font-bold">{c.userName}</div>
                     <div className="text-[10px] text-slate-400">{c.date}</div>
                   </td>
                   <td className="px-8 py-4 text-right">
                     <button 
                        onClick={() => { if(confirm('Delete comment?')) { deleteComment(c.id); refreshData(); } }}
                        className="text-red-500 text-sm font-bold hover:underline"
                      >
                        Delete
                      </button>
                   </td>
                 </tr>
               ))}
               {comments.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-slate-400">No comments to moderate.</td></tr>}
             </tbody>
           </table>
        </div>
      )}

      {activeAdminTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {navItems.filter(i => i.path !== '/' && i.path !== '/blog').map(item => (
            <div key={item.path} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-800">{item.label}</h4>
                  <p className="text-xs text-slate-400">{item.path}</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleTool(item.path)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  enabledTools.includes(item.path) ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                }`}
              >
                {enabledTools.includes(item.path) ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
