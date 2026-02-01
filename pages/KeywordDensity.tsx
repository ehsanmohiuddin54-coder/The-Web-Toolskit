import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  BarChart, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  TrendingUp,
  HelpCircle,
  Shield,
  Zap,
  Globe,
  ExternalLink,
  RefreshCw,
  Eye,
  Filter,
  Target,
  Hash,
  X,
  File,
  BookOpen
} from 'lucide-react';
import { ToolNavigation } from '../components/ToolNavigation';

interface KeywordStats {
  word: string;
  count: number;
  density: number;
  positions: number[];
}

export const KeywordDensity: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [keywords, setKeywords] = useState<KeywordStats[]>([]);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [uniqueWords, setUniqueWords] = useState<number>(0);
  const [seoScore, setSeoScore] = useState<number>(0);
  const [showHighlights, setShowHighlights] = useState<boolean>(true);
  const [minWordLength, setMinWordLength] = useState<number>(3);
  const [showStopWords, setShowStopWords] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showFAQs, setShowFAQs] = useState<boolean>(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [densityWarning, setDensityWarning] = useState<string>('');

  // Common stop words to filter out
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 
    'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 
    'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs'
  ]);

  // Calculate keyword density
  const calculateKeywordDensity = (content: string) => {
    if (!content.trim()) {
      setKeywords([]);
      setTotalWords(0);
      setUniqueWords(0);
      setSeoScore(0);
      setDensityWarning('');
      return;
    }

    // Clean and split text
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= minWordLength && (!showStopWords || !stopWords.has(word)));

    const total = words.length;
    setTotalWords(total);

    // Count word frequencies
    const wordCounts: Record<string, { count: number; positions: number[] }> = {};
    
    words.forEach((word, index) => {
      if (!wordCounts[word]) {
        wordCounts[word] = { count: 0, positions: [] };
      }
      wordCounts[word].count++;
      wordCounts[word].positions.push(index);
    });

    // Convert to array and sort
    const keywordStats: KeywordStats[] = Object.entries(wordCounts)
      .map(([word, data]) => ({
        word,
        count: data.count,
        density: total > 0 ? parseFloat(((data.count / total) * 100).toFixed(2)) : 0,
        positions: data.positions
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50); // Top 50 keywords

    setKeywords(keywordStats);
    setUniqueWords(Object.keys(wordCounts).length);

    // Calculate SEO score (simplified)
    const score = calculateSeoScore(keywordStats);
    setSeoScore(score);

    // Check for density warnings
    checkDensityWarnings(keywordStats);
  };

  const calculateSeoScore = (keywords: KeywordStats[]): number => {
    if (keywords.length === 0) return 0;
    
    let score = 70; // Base score
    
    // Check for optimal density (1-2%)
    const optimalKeywords = keywords.filter(kw => kw.density >= 1 && kw.density <= 2);
    score += optimalKeywords.length * 2;
    
    // Penalize for high density (>3%)
    const highDensity = keywords.filter(kw => kw.density > 3);
    score -= highDensity.length * 3;
    
    // Check for keyword variety
    if (uniqueWords > 50) score += 10;
    if (uniqueWords < 20) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const checkDensityWarnings = (keywords: KeywordStats[]) => {
    const highDensity = keywords.filter(kw => kw.density > 3);
    if (highDensity.length > 0) {
      const words = highDensity.map(kw => kw.word).join(', ');
      setDensityWarning(`Warning: High keyword density detected for: ${words}. Consider reducing usage to avoid keyword stuffing.`);
    } else {
      setDensityWarning('');
    }
  };

  // Handle text change
  const handleTextChange = (value: string) => {
    setText(value);
  };

  // Recalculate on text or settings change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateKeywordDensity(text);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, minWordLength, showStopWords]);

  // Handle download results
  const handleDownload = () => {
    if (!text.trim()) {
      alert('No content to download');
      return;
    }

    const report = `Keyword Density Analysis Report
Generated: ${new Date().toLocaleString()}
Tool: The Web Toolskit Keyword Density Checker
URL: https://thewebtoolskit.com/keyword-density-checker

CONTENT ANALYSIS:
• Total Words: ${totalWords}
• Unique Words: ${uniqueWords}
• SEO Score: ${seoScore}/100
• Minimum Word Length: ${minWordLength}
• Stop Words Filtered: ${showStopWords ? 'Yes' : 'No'}

TOP KEYWORDS (by frequency):
${keywords.slice(0, 20).map(kw => `• "${kw.word}": ${kw.count} occurrences (${kw.density}% density)`).join('\n')}

SEO RECOMMENDATIONS:
${densityWarning ? `⚠️ ${densityWarning}\n` : ''}
• Optimal keyword density: 1-2%
• Target 1-3 primary keywords per page
• Use synonyms and related terms (LSI keywords)
• Avoid keyword stuffing (>3% density)
• Focus on natural language and user intent

RAW CONTENT (first 2000 chars):
${text.substring(0, 2000)}${text.length > 2000 ? '...' : ''}

NOTES:
This report was generated using our free keyword density checker.
For best SEO results, aim for natural keyword distribution.
Visit https://thewebtoolskit.com for more SEO tools.
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyword-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle copy text
  const handleCopyText = async () => {
    if (!text.trim()) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Clear all
  const handleClear = () => {
    setText('');
    setKeywords([]);
    setTotalWords(0);
    setUniqueWords(0);
    setSeoScore(0);
    setDensityWarning('');
  };

  // Load example content
  const loadExample = () => {
    const example = `Search engine optimization (SEO) is the process of improving the quality and quantity of website traffic to a website or a web page from search engines. SEO targets unpaid traffic (known as "natural" or "organic" results) rather than direct traffic or paid traffic.

Keyword research is a fundamental SEO practice that involves identifying popular words and phrases people enter into search engines. Keyword density refers to the percentage of times a keyword appears on a web page compared to the total number of words on the page.

For effective SEO, maintain optimal keyword density between 1% and 2%. Avoid keyword stuffing, which occurs when a web page is loaded with keywords in an attempt to manipulate a site's ranking in search results.

Content quality remains the most important ranking factor. Search engines prioritize helpful, reliable content written for people first. Use keywords naturally within high-quality content that provides value to readers.

Regular keyword density analysis helps ensure your content remains optimized without over-optimization. Tools like this keyword density checker help content creators maintain proper keyword balance while focusing on creating valuable content for their audience.`;
    
    setText(example);
  };

  // Get color for density value
  const getDensityColor = (density: number): string => {
    if (density < 0.5) return 'text-slate-500';
    if (density >= 0.5 && density <= 2) return 'text-green-600';
    if (density > 2 && density <= 3) return 'text-amber-600';
    return 'text-red-600';
  };

  // Get SEO score color
  const getSeoScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const popularKeywords = [
    'keyword density checker',
    'keyword density checker online',
    'free keyword density checker',
    'keyword density tool',
    'online keyword density checker free',
    'keyword density analyzer',
    'keyword density analysis tool',
    'seo keyword density checker',
    'keyword frequency checker',
    'keyword occurrence checker',
    'check keyword density online',
    'analyze keyword density free',
    'calculate keyword density tool',
    'keyword density calculator',
    'easy keyword density checker',
    'fast keyword density checker',
    'simple keyword density tool',
    'instant keyword density analysis',
    'on page seo keyword density tool',
    'content keyword density checker',
    'keyword density checker for seo',
    'website keyword density analyzer',
    'no signup keyword density checker',
    'browser based keyword density tool',
    'seo keyword analyzer',
    'content optimization tool',
    'keyword optimization checker',
    'word frequency analyzer',
    'text keyword analysis',
    'seo content analyzer',
    'keyword stuffing checker',
    'organic seo tool',
    'content density analyzer',
    'web page keyword tool',
    'seo audit keyword tool',
    'free seo analysis tool',
    'keyword research tool',
    'content seo checker',
    'on-page seo analyzer',
    'keyword distribution tool'
  ];

  const faqs = [
    {
      question: 'What is keyword density and why is it important for SEO?',
      answer: 'Keyword density is the percentage of times a keyword appears on a webpage compared to the total word count. It\'s important for SEO because search engines use it to understand page relevance, but excessive density (keyword stuffing) can lead to penalties. Our free keyword density checker helps you maintain optimal density (1-2%) for better rankings.'
    },
    {
      question: 'How does this keyword density checker tool work?',
      answer: 'Simply paste your text content into the editor above, and our tool instantly analyzes word frequencies and calculates density percentages. It filters out common stop words, highlights optimal density ranges, and provides SEO recommendations. All processing happens in real-time as you type or paste.'
    },
    {
      question: 'What is the ideal keyword density for SEO optimization?',
      answer: 'Most SEO experts recommend a keyword density between 1% and 2% for primary keywords. This range shows topical relevance without appearing spammy. Our keyword density analyzer automatically flags keywords exceeding 3% density, which may indicate keyword stuffing that could harm your search rankings.'
    },
    {
      question: 'How can I copy and paste content for analysis?',
      answer: 'You can copy text from any source (web pages, documents, PDFs) and paste it directly into the editor. For PDF files, simply open the PDF, select the text you want to analyze, copy it (Ctrl+C or Cmd+C), and paste it (Ctrl+V or Cmd+V) into our tool. The editor accepts text from any source.'
    },
    {
      question: 'Is this keyword density checker really free with no registration?',
      answer: 'Absolutely! Our keyword density checker is 100% free with no signup, no registration, and no limitations. All analysis happens locally in your browser, ensuring complete privacy. You can analyze unlimited text, download reports, and optimize content without any restrictions.'
    },
    {
      question: 'How can I improve my keyword density for better SEO?',
      answer: 'Focus on natural language, use synonyms and related terms (LSI keywords), avoid keyword repetition, and prioritize content quality. Our tool provides specific recommendations based on your analysis. Remember that user-focused content with proper keyword distribution performs better than artificially optimized text.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">SEO TOOL</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Free Keyword Density Checker Tool
          </h1>
          <p className="text-lg text-emerald-100 mb-6 max-w-3xl">
            Instantly analyze keyword frequency, optimize content for SEO, and avoid keyword stuffing. Copy-paste any text or PDF content for real-time analysis.
          </p>
          <div className="flex flex-wrap gap-2">
            {['100% Free', 'No Registration', 'Copy-Paste Analysis', 'Real-time Results', 'SEO Scoring', 'PDF Text Compatible', 'Browser Based', 'Privacy Focused'].map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-default">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-l from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* SEO Keywords Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-emerald-100">
        <div className="flex flex-wrap gap-2 justify-center">
          {popularKeywords.slice(0, 10).map((keyword, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-default shadow-sm">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Editor & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Editor */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-900">Content Editor</h2>
                <span className="text-sm text-slate-600">{totalWords} words • {uniqueWords} unique</span>
              </div>
              <button
                onClick={handleClear}
                className="text-sm px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder='Paste your content here (copy from any source)...
Example: Copy text from websites, PDFs, or documents and paste here for instant SEO analysis.'
                className="w-full h-80 p-6 focus:outline-none resize-none font-mono text-sm text-slate-700 bg-white"
                spellCheck={false}
              />
              
              {/* Word Count */}
              <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded">
                {totalWords} words • {text.length} chars
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                disabled={!text.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Analysis Report
              </button>
              <button
                onClick={handleCopyText}
                disabled={!text.trim()}
                className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Load Example
              </button>
              <button
                onClick={() => setShowHighlights(!showHighlights)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showHighlights ? 'Hide Highlights' : 'Show Highlights'}
              </button>
            </div>
          </div>

          {/* Analysis Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Min Word Length
                </label>
                <span className="text-sm font-bold text-blue-600">{minWordLength}</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={minWordLength}
                onChange={(e) => setMinWordLength(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Filter Stop Words</div>
                <div className="text-xs text-slate-600">Remove common words like "the", "and", "in"</div>
              </div>
              <button
                onClick={() => setShowStopWords(!showStopWords)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showStopWords ? 'bg-green-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showStopWords ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className={`p-4 rounded-2xl flex items-center justify-center ${getSeoScoreColor(seoScore)}`}>
              <div className="text-center">
                <div className="text-sm font-semibold mb-1">SEO Score</div>
                <div className="text-3xl font-bold">{seoScore}/100</div>
              </div>
            </div>
          </div>

          {/* Density Warnings */}
          {densityWarning && (
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">Keyword Density Warning</h4>
                <p className="text-sm">{densityWarning}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* SEO Score Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                SEO Analysis
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">Keyword Distribution</span>
                    <span className="font-semibold">{seoScore >= 70 ? 'Good' : seoScore >= 50 ? 'Fair' : 'Needs Work'}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${seoScore >= 70 ? 'bg-green-500' : seoScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${seoScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">Content Length</span>
                    <span className="font-semibold">{totalWords >= 300 ? 'Good' : 'Short'}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${totalWords >= 300 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, (totalWords / 500) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">Keyword Variety</span>
                    <span className="font-semibold">{uniqueWords >= 50 ? 'Good' : 'Low'}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${uniqueWords >= 50 ? 'bg-green-500' : uniqueWords >= 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (uniqueWords / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  SEO Recommendations
                </h4>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Aim for 1-2% keyword density
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Target 300+ words per page
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Use synonyms and LSI keywords
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Avoid keyword repetition
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                disabled={!text.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-medium hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Full Report
              </button>
              <button
                onClick={() => {
                  setMinWordLength(3);
                  setShowStopWords(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Analysis Settings
              </button>
              <button
                onClick={loadExample}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                Load Example Content
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Density Table */}
      {keywords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Keyword Density Analysis
              </h3>
              <div className="text-sm text-slate-600">
                Showing top {keywords.length} keywords
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Density
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keywords.map((kw, index) => (
                  <tr 
                    key={`${kw.word}-${index}`} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedKeyword(kw.word)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{kw.word}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{kw.count}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-bold ${getDensityColor(kw.density)}`}>
                        {kw.density}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                        kw.density < 0.5 ? 'bg-slate-100 text-slate-700' :
                        kw.density >= 0.5 && kw.density <= 2 ? 'bg-green-100 text-green-700' :
                        kw.density > 2 && kw.density <= 3 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {kw.density < 0.5 ? 'Low' :
                         kw.density >= 0.5 && kw.density <= 2 ? 'Optimal' :
                         kw.density > 2 && kw.density <= 3 ? 'High' :
                         'Too High'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Why Use Our Free Keyword Density Checker?
          </h2>
          
          <p className="text-lg text-slate-700 mb-6">
            Proper <strong>keyword density</strong> is crucial for <strong>SEO success</strong> and <strong>search engine rankings</strong>. Our <strong>free keyword density checker</strong> provides comprehensive analysis to help you optimize content, avoid <strong>keyword stuffing penalties</strong>, and improve <strong>organic search visibility</strong>. Perfect for content writers, SEO specialists, and digital marketers.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Key Features
              </h3>
              <ul className="space-y-3">
                {[
                  '100% Free - No hidden costs or limitations',
                  'Copy-Paste Analysis - Works with any text source',
                  'PDF Text Compatible - Copy text from PDFs easily',
                  'Real-time Analysis - Instant density calculations',
                  'SEO Scoring - Automated content quality assessment',
                  'Density Warnings - Alerts for keyword stuffing',
                  'Stop Word Filtering - Focus on meaningful keywords',
                  'Download Reports - Save detailed analysis results'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                How to Use
              </h3>
              <ol className="space-y-3 list-decimal pl-5">
                {[
                  'Copy text from any source (website, PDF, document)',
                  'Paste the text into the editor above',
                  'Adjust analysis settings as needed',
                  'View real-time keyword density results',
                  'Download a detailed SEO report',
                  'Optimize your content based on recommendations'
                ].map((item, idx) => (
                  <li key={idx} className="text-slate-700 pl-2">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-8">
            <button
              onClick={() => setShowFAQs(!showFAQs)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-xl transition-colors border border-slate-100"
            >
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions About Keyword Density
              </h3>
              <span className="text-slate-600">{showFAQs ? '▲' : '▼'}</span>
            </button>
            
            {showFAQs && (
              <div className="mt-4 space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 border border-slate-100 hover:border-emerald-200 transition-colors">
                    <h4 className="font-bold text-slate-900 mb-2">{faq.question}</h4>
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Keywords Footer */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Popular SEO Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.slice(15, 35).map((keyword, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-900 to-green-900 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-4">Ready to Optimize Your Content?</h3>
            <p className="text-emerald-100 mb-4">
              Get instant keyword density analysis for free. Perfect for SEO optimization, content writing, and digital marketing. No registration required - start analyzing now!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Try Example Content
              </button>
              <button
                onClick={handleDownload}
                disabled={!text.trim()}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download Analysis Report
              </button>
            </div>
            <div className="mt-4 text-sm text-emerald-300">
              Visit <a href="https://thewebtoolskit.com" className="underline hover:text-white">thewebtoolskit.com</a> for more free SEO tools and resources.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Keywords Footer */}
      <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold mb-3">RELATED SEO KEYWORDS</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularKeywords.slice(25, 45).map((keyword, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-slate-800 rounded hover:text-slate-300 transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-xs mt-4 text-slate-500">
            © {new Date().getFullYear()} The Web Toolskit - Free Keyword Density Checker Tool. All analysis processes locally in your browser.
          </p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};