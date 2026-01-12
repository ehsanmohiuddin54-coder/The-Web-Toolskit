
import React from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../utils/blog-store';

export const BlogList: React.FC = () => {
  const blogs = getBlogs().filter(b => b.status === 'published');

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="max-w-2xl">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">SEO & Marketing Insights</h2>
        <p className="text-lg text-slate-600">Expert guides, industry news, and tutorials to help you master the digital landscape using our free tools.</p>
      </header>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map(blog => (
            <article key={blog.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <Link to={`/blog/${blog.slug}`}>
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{blog.category}</span>
                    <span className="text-xs text-slate-400">{blog.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{blog.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm mb-6">{blog.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-slate-400">#{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
           <p className="text-slate-400">No blogs published yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};
