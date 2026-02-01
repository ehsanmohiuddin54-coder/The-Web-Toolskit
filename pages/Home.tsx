import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Search, 
  Shield, 
  Zap, 
  BarChart, 
  FileText, 
  Code, 
  Edit, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Users,
  Menu,
  X,
  Download,
  Tag,
  Calculator,
  Type,
  Filter,
  TrendingUp,
  Lock,
  Cpu,
  BookOpen,
  Briefcase,
  Scissors,
  FileEdit,
  Hash
} from 'lucide-react';

const toolCategories = [
  {
    id: 'seo-content',
    name: 'SEO & Content Optimization',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
    description: 'Boost your search engine rankings with precision SEO analysis tools for better content optimization.',
    tools: [
      {
        title: 'Keyword Density Checker',
        desc: 'Analyze word frequency to avoid keyword stuffing and improve SEO relevance for higher rankings.',
        icon: <BarChart className="w-6 h-6" />,
        path: '/keyword-density',
        color: 'bg-orange-500',
        badge: 'SEO',
        keywords: ['seo analyzer', 'keyword analysis', 'content optimization']
      },
      {
        title: 'Meta Tag Generator',
        desc: 'Create high-converting Google, Facebook, and Twitter meta snippets instantly for better CTR.',
        icon: <Tag className="w-6 h-6" />,
        path: '/meta-generator',
        color: 'bg-rose-500',
        badge: 'Ranking',
        keywords: ['meta tags', 'snippet generator', 'social media preview']
      }
    ]
  },
  {
    id: 'text-writing',
    name: 'Text & Writing Tools',
    icon: <Type className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    description: 'Professional text manipulation utilities for writers, editors, and content creators.',
    tools: [
      {
        title: 'Online Word Counter',
        desc: 'Detailed metrics including character count, reading time, and sentence length analysis.',
        icon: <FileText className="w-6 h-6" />,
        path: '/word-counter',
        color: 'bg-blue-500',
        badge: 'Writing',
        keywords: ['word counter', 'character count', 'reading time calculator'],
        featured: true
      },
      {
        title: 'Case Converter',
        desc: 'Change text to UPPERCASE, lowercase, Title Case, or Sentence case instantly.',
        icon: <Edit className="w-6 h-6" />,
        path: '/case-converter',
        color: 'bg-purple-500',
        badge: 'Utility',
        keywords: ['text case', 'case converter', 'string manipulation']
      },
      {
        title: 'Pro Text Cleaner',
        desc: 'Remove extra spaces, tabs, and unwanted formatting from any text with precision.',
        icon: <Filter className="w-6 h-6" />,
        path: '/text-cleaner',
        color: 'bg-emerald-500',
        badge: 'Clean',
        keywords: ['text cleaner', 'format remover', 'space cleaner']
      },
      {
        title: 'Character Remover',
        desc: 'Filter out specific symbols, numbers, or characters from your strings efficiently.',
        icon: <Scissors className="w-6 h-6" />,
        path: '/char-remover',
        color: 'bg-slate-500',
        badge: 'Filter',
        keywords: ['character filter', 'symbol remover', 'text sanitizer']
      }
    ]
  },
  {
    id: 'developer-utilities',
    name: 'Developer & Data Utilities',
    icon: <Cpu className="w-5 h-5" />,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    description: 'Essential formatting and processing tools for developers and data analysts.',
    tools: [
      {
        title: 'JSON Formatter & Validator',
        desc: 'Beautify messy JSON code and validate syntax for error-free development.',
        icon: <Code className="w-6 h-6" />,
        path: '/json-formatter',
        color: 'bg-indigo-500',
        badge: 'Dev',
        keywords: ['json formatter', 'code beautifier', 'data validation'],
        featured: true
      },
      {
        title: 'GPA Calculator',
        desc: 'A simple tool for students to calculate semester and cumulative GPA accurately.',
        icon: <Calculator className="w-6 h-6" />,
        path: '/gpa-calculator',
        color: 'bg-cyan-500',
        badge: 'Education',
        keywords: ['gpa calculator', 'grade calculator', 'academic calculator']
      }
    ]
  }
];

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Get all tools for search
  const allTools = toolCategories.flatMap(cat => cat.tools.map(tool => ({
    ...tool,
    category: cat.name,
    categoryId: cat.id
  })));

  // Calculate total tools count
  const totalTools = allTools.length;

  // Filter tools based on search
  const filteredTools = searchQuery 
    ? allTools.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords?.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : activeCategory === 'all'
      ? allTools
      : allTools.filter(tool => tool.categoryId === activeCategory);

  // Featured tools
  const featuredTools = allTools.filter(tool => tool.featured);

  // Popular tools (based on usage stats) - Updated to remove PDF Editor
  const popularTools = [
    allTools.find(t => t.path === '/word-counter'),
    allTools.find(t => t.path === '/json-formatter'),
    allTools.find(t => t.path === '/keyword-density'),
    allTools.find(t => t.path === '/case-converter'),
    allTools.find(t => t.path === '/text-cleaner'),
    allTools.find(t => t.path === '/char-remover'),
    allTools.find(t => t.path === '/meta-generator'),
    allTools.find(t => t.path === '/gpa-calculator'),
  ].filter(Boolean).slice(0, 6);

  // Handle category navigation
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length > 0) {
      navigate(filteredTools[0].path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}


            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">The Web Toolskit</h1>
                <p className="text-xs text-slate-500">Free Online Tools</p>
              </div>
            </Link>

           
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/www.thewebtoolskit.com" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                  <span>Tools</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {toolCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        {category.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{category.name}</p>
                        <p className="text-xs text-slate-500">{category.tools.length} tools</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Removed About and Contact links */}
            </nav>

            {/* Search and CTA */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hidden md:block relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-48 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </form>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-4 py-3 space-y-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </form>
              {toolCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className="w-full text-left block py-2 text-slate-700 hover:text-indigo-600 font-medium"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* SEO Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-semibold mb-8 border border-indigo-100 shadow-sm">
            <Shield className="w-4 h-4" />
            <span>100% Secure & Private Processing</span>
          </div>

          {/* Main Heading focusing on ALL tools */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Free Online Tools
            </span>
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl block mt-4">
              For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Writers</span>,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Developers</span> &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500"> Students</span>
            </span>
          </h1>

          {/* Subtitle focusing on ALL 8 tools */}
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Access <strong>{totalTools} powerful free online tools</strong> including <strong>Word Counter, JSON Formatter, 
            Text Cleaner, Case Converter, Character Remover, SEO Analyzer, Meta Generator, and GPA Calculator</strong>. 
            All tools process data locally in your browser - your privacy is guaranteed.
          </p>

          {/* CTA Buttons for multiple tools */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link 
              to="/word-counter" 
              className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-100 flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Word Counter</span>
            </Link>
            <Link 
              to="/json-formatter" 
              className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-100 flex items-center space-x-2"
            >
              <Code className="w-5 h-5" />
              <span>JSON Formatter</span>
            </Link>
            <Link 
              to="/keyword-density" 
              className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-100 flex items-center space-x-2"
            >
              <BarChart className="w-5 h-5" />
              <span>SEO Analyzer</span>
            </Link>
            <Link 
              to="/gpa-calculator" 
              className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-100 flex items-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>GPA Calculator</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { label: 'Total Tools', value: `${totalTools}+`, icon: <Cpu className="w-5 h-5" /> },
              { label: 'Users Served', value: '50K+', icon: <Users className="w-5 h-5" /> },
              { label: 'Countries', value: '150+', icon: <Globe className="w-5 h-5" /> },
              { label: 'Processing Time', value: 'Instant', icon: <Zap className="w-5 h-5" /> }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow-lg">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Featured Tools</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover our most popular tools used by thousands of writers, developers, and students worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, idx) => tool && (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 text-xs font-bold text-white ${tool.color} rounded-full`}>
                    {tool.badge}
                  </span>
                </div>
                <div className={`w-14 h-14 ${tool.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-4`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{tool.desc}</p>
                <div className="flex items-center text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Use Tool Now</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">The Web Toolskit</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide the best online tools with a focus on privacy, speed, and user experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-8 h-8" />,
                title: '100% Privacy Focused',
                description: 'All processing happens locally in your browser. Your data never leaves your computer.',
                color: 'text-green-600 bg-green-50'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'No server delays. Get instant results with our optimized JavaScript tools.',
                color: 'text-orange-600 bg-orange-50'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: `${totalTools}+ Free Tools`,
                description: 'Complete suite of tools for writing, development, and SEO - all completely free.',
                color: 'text-blue-600 bg-blue-50'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'No Registration',
                description: 'Start using tools immediately. No sign-up, no email required.',
                color: 'text-purple-600 bg-purple-50'
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: 'Free Forever',
                description: 'All tools are completely free with no hidden costs or limitations.',
                color: 'text-red-600 bg-red-50'
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'Developer Friendly',
                description: 'Clean interfaces, keyboard shortcuts, and API-ready outputs.',
                color: 'text-indigo-600 bg-indigo-50'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools by Category */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Browse All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{totalTools}+ Free Tools</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Organized by category for easy navigation. Find the perfect tool for your needs.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'}`}
            >
              All Tools ({totalTools})
            </button>
            {toolCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${activeCategory === category.id ? 'bg-gradient-to-r ' + category.color + ' text-white' : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'}`}
              >
                {category.name} ({category.tools.length})
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.path}
                className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold text-white ${tool.color} rounded-full`}>
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{tool.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {tool.category}
                  </div>
                  <div className="flex items-center text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Sections with IDs for navigation */}
      {toolCategories.map(category => (
        <section key={category.id} id={category.id} className="py-20 px-4 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.color}`}>
                {category.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{category.name}</h2>
                <p className="text-slate-600">{category.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map(tool => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${tool.color}`}>
                      {tool.icon}
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold text-white ${tool.color} rounded-full`}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{tool.desc}</p>
                  <div className="flex items-center text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Use Tool</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* SEO Content Section - Updated for ALL tools */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Complete Suite of Free Online Tools for Every Need
            </h2>
            
            <p className="text-lg text-slate-700 mb-6">
              <strong>The Web Toolskit</strong> provides <strong>{totalTools} powerful free online tools</strong> designed to enhance 
              your digital workflow. Whether you're a <strong>student writing essays</strong>, a <strong>developer working with code</strong>, 
              or a <strong>marketer optimizing content</strong>, we have the perfect tools for you.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">For Writers & Students</h3>
                <ul className="space-y-3">
                  {[
                    'Word Counter for essays, articles, and assignments',
                    'Text Cleaner for formatting papers',
                    'Case Converter for text styling',
                    'Character Remover for text sanitization',
                    'GPA Calculator for academic tracking',
                    'SEO tools for content optimization'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">For Developers & Professionals</h3>
                <ul className="space-y-3">
                  {[
                    'JSON Formatter for API development',
                    'SEO Tools for content optimization',
                    'Meta Generator for social media',
                    'Keyword Density Checker for SEO',
                    'Text utilities for content creation',
                    'Developer-friendly interfaces'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 my-8 border border-indigo-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Key Benefits of Our Tools:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span><strong>All Tools are 100% Free</strong> - No hidden costs or limitations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span><strong>Complete Privacy</strong> - Your data never leaves your computer</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span><strong>Instant Processing</strong> - No waiting, no server delays</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span><strong>Mobile Friendly</strong> - Works perfectly on all devices</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span><strong>No Registration</strong> - Start using tools immediately</span>
                </li>
              </ul>
            </div>

            <p className="text-lg text-slate-700 mb-6">
              From <strong>SEO optimization tools</strong> to <strong>developer utilities</strong> and <strong>writing assistants</strong>, 
              The Web Toolskit offers everything you need for content creation, data processing, and digital optimization. 
              Our tools are constantly updated to provide the best user experience while maintaining our commitment 
              to privacy and security.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-12 md:p-16 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Boost Your Productivity?
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust The Web Toolskit for their daily needs. 
                Access all {totalTools} tools completely free - no registration required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/word-counter" 
                  className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 shadow-lg"
                >
                  Start with Word Counter
                </Link>
                <Link 
                  to="/json-formatter" 
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg"
                >
                  Try JSON Formatter
                </Link>
                <Link 
                  to="/keyword-density" 
                  className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg"
                >
                  Use SEO Analyzer
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">The Web Toolskit</h3>
                  <p className="text-slate-400 text-sm">Free Online Tools</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Providing {totalTools} free, privacy-focused online tools for writers, developers, and students.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">All {totalTools} Tools</h4>
              <ul className="space-y-3">
                {allTools.slice(0, 6).map((tool, idx) => (
                  <li key={idx}>
                    <Link to={tool.path} className="text-slate-400 hover:text-white transition-colors text-sm">
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Tool Categories</h4>
              <ul className="space-y-3">
                {toolCategories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => scrollToCategory(category.id)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          
          </div>

          {/* SEO Keywords */}
          <div className="border-t border-slate-800 pt-8">
            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm mb-4 font-semibold">POPULAR TOOLS & KEYWORDS</p>
              <div className="flex flex-wrap justify-center gap-2">
                {allTools.flatMap(tool => tool.keywords || []).concat([
                  'free online tools',
                  'browser based utilities',
                  'privacy focused tools',
                  'no registration required',
                  'instant processing',
                  'local data processing'
                ]).slice(0, 15).map((keyword, idx) => (
                  <span key={idx} className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-default px-2">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center text-slate-500 text-sm pt-6 border-t border-slate-800">
              <p>© {new Date().getFullYear()} The Web Toolskit. All rights reserved.</p>
              <p className="mt-2">All {totalTools} tools process data locally in your browser. No data is stored on our servers.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};