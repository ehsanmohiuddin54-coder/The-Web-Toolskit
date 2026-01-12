
import { BlogPost } from '../types';

const STORAGE_KEY = 'seo_utility_blogs';

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Master SEO in 2025',
    slug: 'master-seo-2025',
    content: 'SEO is constantly evolving. In 2025, the focus has shifted entirely towards user intent and technical excellence. Search engines are smarter, meaning your content needs to be more human...',
    summary: 'Discover the top strategies for ranking higher in 2025 using our free browser-based tools.',
    author: 'SEO Admin',
    date: new Date().toISOString().split('T')[0],
    status: 'published',
    category: 'SEO Strategy',
    tags: ['seo', 'marketing', '2025'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    seoTitle: 'Master SEO 2025: Complete Guide | SEO Utility',
    seoDescription: 'Learn how to rank higher in search results with the latest 2025 SEO trends and tools.'
  }
];

export const getBlogs = (): BlogPost[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
  return JSON.parse(stored);
};

export const saveBlog = (blog: BlogPost) => {
  const blogs = getBlogs();
  const index = blogs.findIndex(b => b.id === blog.id);
  if (index > -1) {
    blogs[index] = blog;
  } else {
    blogs.push(blog);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
};

export const deleteBlog = (id: string) => {
  const blogs = getBlogs().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
};

export const getBlogBySlug = (slug: string): BlogPost | undefined => {
  return getBlogs().find(b => b.slug === slug);
};
