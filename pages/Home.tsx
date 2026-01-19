import React from 'react';
import { Link } from 'react-router-dom';
// Note: You may need to install react-helmet-async for SEO meta tags
// import { Helmet } from 'react-helmet-async'; 

const toolCategories = [
  {
    name: 'SEO & Content Optimization',
    icon: '🚀',
    description: 'Boost your search engine rankings with our precision SEO analysis tools.',
    tools: [
      {
        title: 'Keyword Density Checker',
        desc: 'Analyze word frequency to avoid keyword stuffing and improve SEO relevance.',
        icon: '📊',
        path: '/keyword-density',
        color: 'bg-orange-50 text-orange-600',
        badge: 'SEO'
      },
      {
        title: 'Meta Tag Generator',
        desc: 'Create high-converting Google, Facebook, and Twitter meta snippets instantly.',
        icon: '🏷️',
        path: '/meta-generator',
        color: 'bg-rose-50 text-rose-600',
        badge: 'Ranking'
      }
    ]
  },
  {
    name: 'Advanced Text Refinement',
    icon: '✍️',
    description: 'Professional text manipulation utilities for writers, editors, and marketers.',
    tools: [
      {
        title: 'Online Word Counter',
        desc: 'Detailed metrics including character count, reading time, and sentence length.',
        icon: '🔢',
        path: '/word-counter',
        color: 'bg-blue-50 text-blue-600',
        badge: 'Writing'
      },
      {
        title: 'Case Converter',
        desc: 'Change text to UPPERCASE, lowercase, Title Case, or Sentence case.',
        icon: '🔠',
        path: '/case-converter',
        color: 'bg-purple-50 text-purple-600',
        badge: 'Utility'
      },
      {
        title: 'Pro Text Cleaner',
        desc: 'Remove extra spaces, tabs, and unwanted formatting from any text.',
        icon: '🧹',
        path: '/text-cleaner',
        color: 'bg-emerald-50 text-emerald-600',
        badge: 'Clean'
      },
      {
        title: 'Character Remover',
        desc: 'Filter out specific symbols, numbers, or characters from your strings.',
        icon: '🚫',
        path: '/char-remover',
        color: 'bg-slate-100 text-slate-600',
        badge: 'Filter'
      }
    ]
  },
  {
    name: 'Developer & Data Utilities',
    icon: '🛠️',
    description: 'Essential formatting tools for developers and data analysts.',
    tools: [
      {
        title: 'JSON Formatter & Validator',
        desc: 'Beautify messy JSON code and validate syntax for error-free development.',
        icon: '📦',
        path: '/json-formatter',
        color: 'bg-indigo-50 text-indigo-600',
        badge: 'Dev'
      },
      {
        title: 'GPA Calculator',
        desc: 'A simple tool for students to calculate semester and cumulative GPA.',
        icon: '🎓',
        path: '/gpa-calculator',
        color: 'bg-cyan-50 text-cyan-600',
        badge: 'Education'
      }
    ]
  }
];

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 animate-in fade-in duration-700 pb-20">
      {/* SEO META TAGS SECTION (Conceptual - Use with React Helmet) */}
      {/* 
      <Helmet>
        <title>The Web Toolskit - All-in-One Online Web Tools & SEO Analyzer</title>
        <meta name="description" content="Access The Web Toolskit: a free, privacy-first collection of SEO tools, word counters, JSON formatters, and text utilities. 100% browser-based processing for maximum security." />
        <meta name="keywords" content="The Web Toolskit, free online tools, SEO analyzer, word counter, JSON formatter, meta tag generator, text cleaner, privacy web tools, developer utilities" />
        <link rel="canonical" href="https://thewebtoolskit.com/" />
      </Helmet> 
      */}

      {/* Hero Section */}
      <section className="relative pt-12 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100 shadow-sm">
          <span>The Web Toolskit: Private & Secure</span>
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.05] tracking-tight">
          Master Your Digital Workflow with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            The Web Toolskit.
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate destination for **free online web tools**. Optimize SEO, format code, and refine text without ever uploading your data. **The Web Toolskit** runs 100% in your browser.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/" className="px-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center space-x-2 text-lg">
            <span>Explore All Tools</span>
            <span>↓</span>
          </a>
          <Link to="/meta-generator" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all text-lg">
            SEO Tools
          </Link>
        </div>
        
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute top-20 -right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      </section>

      {/* Trust & SEO Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
         {[
           { title: 'Data Privacy', desc: 'The Web Toolskit processes everything locally. Your sensitive information never leaves your computer.', icon: '🛡️' },
           { title: 'Lightning Speed', desc: 'No server-side lag. Enjoy instant results with our optimized JavaScript-based web tools.', icon: '⚡' },
           { title: 'SEO Optimized', desc: 'Built by marketers for marketers. Use our keyword and meta tools to dominate search results.', icon: '📈' }
         ].map((feature, i) => (
           <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white shadow-lg shadow-slate-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
           </div>
         ))}
      </section>

      {/* Main Tools Container */}
      <div id="tools" className="max-w-6xl mx-auto px-4 space-y-24">
        {toolCategories.map((cat, idx) => (
          <section key={idx} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{cat.name}</h2>
                  <p className="text-slate-500 text-sm">{cat.description}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.tools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:rotate-6`}>
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-3 py-1 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{tool.desc}</p>
                  <div className="flex items-center text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Use Tool Free</span>
                    <span className="ml-2">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* SEO RICH CONTENT SECTION - For Google Ranking */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Why Professionals Choose The Web Toolskit</h2>
          <p className="text-lg text-slate-600 mb-6">
            In the modern digital landscape, efficiency and privacy are paramount. **The Web Toolskit** was designed to provide a comprehensive suite of utilities that empower SEO experts, content writers, and developers to perform daily tasks without the fear of data leaks.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Comprehensive SEO Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our **Keyword Density Checker** and **Meta Tag Generator** help you stay ahead of algorithm updates. By analyzing your content's structure locally, you can optimize for Google's SERPs without revealing your niche strategies to third-party servers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Writer-Centric Text Tools</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                From an advanced **Online Word Counter** to a smart **Case Converter**, we provide everything needed for content cleanup. Our **Text Cleaner** is specifically built to strip hidden formatting from Word or Google Docs, making it ready for CMS publishing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Developer Workflow Tools</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The **JSON Formatter & Validator** is a staple for developers. Quickly debug data structures or beautify API responses in a clean, isolated environment. No more pasting sensitive client data into random websites.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Student & Academic Success</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The Web Toolskit isn't just for business. Our **GPA Calculator** helps students track their academic progress with ease, providing instant calculations for semester planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10 text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              Ready to Optimize Your Workflow?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Join thousands of users who trust **The Web Toolskit** for their daily SEO, text manipulation, and development needs. Fast, free, and forever private.
            </p>
            <div className="flex justify-center gap-6">
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all">
                    Start Using Tools
                </button>
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
      </section>

      {/* Footer Keywords Section */}
      <footer className="max-w-6xl mx-auto px-4 pb-12 text-center">
        <div className="border-t border-slate-100 pt-12">
            <p className="text-slate-400 text-sm mb-4 font-bold uppercase tracking-widest">The Web Toolskit Keywords</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
                <span>Free SEO Tools</span>
                <span>Online Text Editor</span>
                <span>JSON Validator</span>
                <span>Word Counter Online</span>
                <span>Privacy First Web Tools</span>
                <span>Meta Tag Generator</span>
                <span>Keyword Density Tool</span>
                <span>Bulk Text Cleaner</span>
                <span>Developer Productivity</span>
            </div>
            <p className="mt-10 text-slate-300 text-xs">
              © {new Date().getFullYear()} The Web Toolskit. All rights reserved. No data is stored on our servers.
            </p>
        </div>
      </footer>
    </div>
  );
};