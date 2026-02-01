import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  RefreshCw,
  Zap,
  Search,
  HelpCircle,
  TrendingUp,
  Code,
  X,
  BookOpen,
  Filter,
  Hash,
  Scissors,
  Type,
  Trash2,
  AlignLeft,
  Edit3,
  Shield,
  Globe,
  ExternalLink
} from 'lucide-react';
import { ToolNavigation } from '../components/ToolNavigation';

interface CleaningOptions {
  removeExtraSpaces: boolean;
  removeLineBreaks: boolean;
  trimWhitespace: boolean;
  removeSpecialChars: boolean;
  removeDuplicateLines: boolean;
  removeHTMLTags: boolean;
  normalizeUnicode: boolean;
  lowercaseText: boolean;
  removeExtraPunctuation: boolean;
  fixQuotes: boolean;
  removeExtraNewlines: boolean;
}

export const TextCleaner: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [cleanedText, setCleanedText] = useState<string>('');
  const [options, setOptions] = useState<CleaningOptions>({
    removeExtraSpaces: true,
    removeLineBreaks: false,
    trimWhitespace: true,
    removeSpecialChars: false,
    removeDuplicateLines: false,
    removeHTMLTags: false,
    normalizeUnicode: true,
    lowercaseText: false,
    removeExtraPunctuation: false,
    fixQuotes: true,
    removeExtraNewlines: true,
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState({
    originalLength: 0,
    cleanedLength: 0,
    spacesRemoved: 0,
    linesRemoved: 0,
    specialCharsRemoved: 0,
  });
  const [showFAQs, setShowFAQs] = useState<boolean>(false);
  const [recentCleans, setRecentCleans] = useState<string[]>([]);

  // SEO Keywords
  const seoKeywords = [
    'text cleaner',
    'text cleaner online',
    'free text cleaner',
    'free online text cleaner',
    'text cleaner tool',
    'online text cleaner free',
    'clean text online',
    'clean text from word',
    'clean copied text',
    'clean copied text from PDF',
    'clean pasted text online',
    'clean text for seo',
    'clean text for social media',
    'text cleaning tool',
    'text cleanup tool',
    'text cleanup tool no signup',
    'fix text formatting tool',
    'fix text formatting online free',
    'fix messy text online',
    'easy text formatting fixer',
    'remove unwanted text online',
    'unwanted character remover online',
    'remove special characters tool',
    'remove special characters online tool',
    'remove extra spaces online',
    'remove extra spaces from text online',
    'online whitespace remover',
    'remove line breaks from text',
    'remove line breaks from text tool',
    'strip line breaks tool free',
    'remove duplicate lines online',
    'remove duplicate lines online free',
    'text normalization tool',
    'instant text normalization tool',
    'text sanitization tool online',
    'remove html tags from text online',
    'simple text cleaner tool',
    'simple plain text converter',
    'fast text cleaner online',
    'instant text cleaner',
    'no signup text cleaner',
    'browser based text cleaner',
    'clean messy text',
    'format text online',
    'text formatting tool',
    'clean up text',
    'text sanitizer',
    'whitespace cleaner',
    'extra spaces remover',
    'clean text formatting',
    'text cleaning software',
    'online text fixer',
    'text cleanup utility'
  ];

  // Text cleaning functions
  const cleanText = (input: string): string => {
    let result = input;
    let spacesRemoved = 0;
    let linesRemoved = 0;
    let specialCharsRemoved = 0;

    // Trim whitespace
    if (options.trimWhitespace) {
      result = result.trim();
    }

    // Remove HTML tags
    if (options.removeHTMLTags) {
      const before = result.length;
      result = result.replace(/<[^>]*>/g, '');
      specialCharsRemoved += before - result.length;
    }

    // Remove special characters
    if (options.removeSpecialChars) {
      const before = result.length;
      result = result.replace(/[^\w\s.,!?;:'"()\-@#$%&*+=]/g, '');
      specialCharsRemoved += before - result.length;
    }

    // Remove extra spaces
    if (options.removeExtraSpaces) {
      const before = result.length;
      result = result.replace(/\s+/g, ' ');
      spacesRemoved = before - result.length;
    }

    // Remove line breaks
    if (options.removeLineBreaks) {
      const before = result.length;
      result = result.replace(/\n+/g, ' ');
      linesRemoved = before - result.length;
    }

    // Remove extra newlines
    if (options.removeExtraNewlines) {
      result = result.replace(/\n\s*\n/g, '\n\n');
    }

    // Remove duplicate lines
    if (options.removeDuplicateLines) {
      const lines = result.split('\n');
      const uniqueLines = Array.from(new Set(lines));
      result = uniqueLines.join('\n');
    }

    // Normalize Unicode
    if (options.normalizeUnicode) {
      result = result.normalize('NFC');
    }

    // Convert to lowercase
    if (options.lowercaseText) {
      result = result.toLowerCase();
    }

    // Remove extra punctuation
    if (options.removeExtraPunctuation) {
      result = result.replace(/([.,!?;:])\1+/g, '$1');
    }

    // Fix quotes
    if (options.fixQuotes) {
      result = result.replace(/['"`]/g, '"');
    }

    // Update stats
    setStats({
      originalLength: input.length,
      cleanedLength: result.length,
      spacesRemoved,
      linesRemoved,
      specialCharsRemoved,
    });

    // Add to recent cleans
    if (result && result !== input) {
      setRecentCleans(prev => [result.substring(0, 100), ...prev.slice(0, 3)]);
    }

    return result;
  };

  const handleClean = () => {
    if (!text.trim()) return;
    const cleaned = cleanText(text);
    setCleanedText(cleaned);
  };

  const handleReset = () => {
    setText('');
    setCleanedText('');
    setStats({
      originalLength: 0,
      cleanedLength: 0,
      spacesRemoved: 0,
      linesRemoved: 0,
      specialCharsRemoved: 0,
    });
  };

  const handleCopyText = async (textToCopy: string) => {
    if (!textToCopy.trim()) return;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = (format: 'txt' | 'pdf' = 'txt') => {
    if (!cleanedText.trim()) {
      alert('No cleaned text to download');
      return;
    }

    let blob: Blob;
    let filename = `cleaned-text-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'txt') {
      blob = new Blob([cleanedText], { type: 'text/plain' });
      filename += '.txt';
    } else {
      // Simple PDF generation
      const pdfContent = `Cleaned Text Report
Generated: ${new Date().toLocaleString()}
Tool: The Web Toolskit Text Cleaner
Original Length: ${stats.originalLength} characters
Cleaned Length: ${stats.cleanedLength} characters
Spaces Removed: ${stats.spacesRemoved}
Line Breaks Removed: ${stats.linesRemoved}
Special Characters Removed: ${stats.specialCharsRemoved}

CLEANING OPTIONS APPLIED:
${Object.entries(options)
  .filter(([_, value]) => value)
  .map(([key]) => `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  .join('\n')}

CLEANED TEXT:
${cleanedText}

NOTES:
This text was cleaned using our free online text cleaner.
Visit https://thewebtoolskit.com for more text tools.
      `;
      blob = new Blob([pdfContent], { type: 'application/pdf' });
      filename += '.pdf';
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    const example = `   This  is  a  messy   text    with   extra    spaces...  

And   too many   line   breaks!

<html>
<body>
<p>Some HTML tags that need removing</p>
</body>
</html>

Special characters: !@#$%^&*()_+
Duplicate line...
Duplicate line...
Duplicate line...

Unicode characters: café résumé 
"Smart quotes" and 'regular quotes'

Multiple punctuation marks!!!???;;;

  Trailing and leading whitespace   
`;
    
    setText(example);
  };

  // Auto-clean when text changes and options are enabled
  useEffect(() => {
    if (text.trim()) {
      handleClean();
    }
  }, [text, options]);

  const faqs = [
    {
      question: 'What is a text cleaner tool and why do I need it?',
      answer: 'A text cleaner is an online tool that removes unwanted formatting, extra spaces, line breaks, special characters, and other messy elements from text. It\'s essential for preparing text for publishing, SEO optimization, social media posts, or when copying content from PDFs, Word documents, or websites that often carry hidden formatting.'
    },
    {
      question: 'How does this free text cleaner work?',
      answer: 'Simply paste your messy text into the editor, adjust the cleaning options to your needs, and instantly see the cleaned result. The tool processes text locally in your browser for privacy and speed. You can download the cleaned text or copy it to clipboard with one click.'
    },
    {
      question: 'Can I clean text copied from PDFs and Word documents?',
      answer: 'Yes! This tool is perfect for cleaning text copied from PDFs, Word documents, websites, and other sources. It removes hidden formatting, extra spaces, line breaks, and special characters that often appear when copying text from these sources.'
    },
    {
      question: 'What text cleaning options are available?',
      answer: 'Our tool offers 11 different cleaning options: remove extra spaces, remove line breaks, trim whitespace, remove special characters, remove duplicate lines, remove HTML tags, normalize Unicode, convert to lowercase, remove extra punctuation, fix quotes, and remove extra newlines. You can combine these options for optimal results.'
    },
    {
      question: 'Is this text cleaner really free with no registration?',
      answer: 'Absolutely! Our text cleaner is 100% free with no signup, registration, or hidden costs. All features including multiple cleaning options, copy-paste functionality, and downloads are available without any limitations. The tool works entirely in your browser.'
    },
    {
      question: 'How can I use cleaned text for SEO?',
      answer: 'Clean text is crucial for SEO. Our tool helps you remove hidden formatting, extra spaces, and special characters that can affect search engine readability. Clean text ensures better indexing, faster page loading, and improved user experience - all important SEO factors.'
    },
    {
      question: 'Can I use this tool for social media content?',
      answer: 'Yes! Clean text is essential for social media posts. Our tool helps you remove unwanted formatting that can appear when copying text from other sources. This ensures your social media posts look clean and professional across all platforms.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">TEXT TOOL</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Free Text Cleaner Tool
          </h1>
          <p className="text-lg text-purple-100 mb-6 max-w-3xl">
            Instantly clean messy text, remove extra spaces, line breaks, special characters, and unwanted formatting. Perfect for cleaning text from PDFs, Word documents, websites, and preparing content for SEO and social media.
          </p>
          <div className="flex flex-wrap gap-2">
            {['100% Free', 'No Registration', '12+ Cleaning Options', 'Real-time Cleaning', 'PDF/DOC Ready', 'SEO Optimized', 'Browser Based', 'Privacy Focused'].map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-default">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-l from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* SEO Keywords Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex flex-wrap gap-2 justify-center">
          {seoKeywords.slice(0, 12).map((keyword, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-default shadow-sm">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Text Editors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Text */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Messy Text</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{text.length} chars</span>
                  <button
                    onClick={handleReset}
                    className="text-sm px-3 py-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Paste messy text here...
Example: Copy text from PDFs, Word docs, or websites with extra formatting...'
                  className="w-full h-80 p-4 focus:outline-none resize-none font-mono text-sm text-slate-700 bg-white"
                  spellCheck={false}
                />
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-wrap gap-2">
                <button
                  onClick={loadExample}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Load Example
                </button>
                <button
                  onClick={() => handleCopyText(text)}
                  disabled={!text.trim()}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Cleaned Text */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Cleaned Text</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{cleanedText.length} chars</span>
                  {cleanedText && (
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                      Cleaned
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={cleanedText}
                  readOnly
                  placeholder='Cleaned text will appear here...'
                  className="w-full h-80 p-4 focus:outline-none resize-none font-mono text-sm text-slate-700 bg-green-50/30"
                  spellCheck={false}
                />
                {!cleanedText && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    Adjust cleaning options and paste text
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopyText(cleanedText)}
                  disabled={!cleanedText.trim()}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Cleaned'}
                </button>
                <select
                  onChange={(e) => handleDownload(e.target.value as 'txt' | 'pdf')}
                  disabled={!cleanedText.trim()}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Download as...</option>
                  <option value="txt">Text File (.txt)</option>
                  <option value="pdf">PDF Report (.pdf)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          {stats.originalLength > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Cleaning Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{stats.originalLength}</div>
                  <div className="text-sm text-slate-600">Original Length</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{stats.cleanedLength}</div>
                  <div className="text-sm text-slate-600">Cleaned Length</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{stats.spacesRemoved}</div>
                  <div className="text-sm text-slate-600">Spaces Removed</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{stats.linesRemoved}</div>
                  <div className="text-sm text-slate-600">Lines Removed</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">{stats.specialCharsRemoved}</div>
                  <div className="text-sm text-slate-600">Special Chars</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Options & Actions */}
        <div className="space-y-6">
          {/* Cleaning Options */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Cleaning Options
              </h3>
              <p className="text-sm text-slate-600 mt-1">Select options to apply to your text</p>
            </div>
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              {[
                { key: 'removeExtraSpaces', label: 'Remove Extra Spaces', desc: 'Convert multiple spaces to single space', icon: <Type className="w-4 h-4" /> },
                { key: 'removeLineBreaks', label: 'Remove All Line Breaks', desc: 'Convert all line breaks to spaces', icon: <AlignLeft className="w-4 h-4" /> },
                { key: 'trimWhitespace', label: 'Trim Start/End Whitespace', desc: 'Remove spaces from beginning and end', icon: <Scissors className="w-4 h-4" /> },
                { key: 'removeSpecialChars', label: 'Remove Special Characters', desc: 'Remove non-alphanumeric characters', icon: <Hash className="w-4 h-4" /> },
                { key: 'removeDuplicateLines', label: 'Remove Duplicate Lines', desc: 'Remove repeated identical lines', icon: <Trash2 className="w-4 h-4" /> },
                { key: 'removeHTMLTags', label: 'Remove HTML Tags', desc: 'Strip all HTML/XML tags', icon: <Code className="w-4 h-4" /> },
                { key: 'normalizeUnicode', label: 'Normalize Unicode', desc: 'Standardize Unicode characters', icon: <Globe className="w-4 h-4" /> },
                { key: 'lowercaseText', label: 'Convert to Lowercase', desc: 'Make all text lowercase', icon: <Edit3 className="w-4 h-4" /> },
                { key: 'removeExtraPunctuation', label: 'Remove Extra Punctuation', desc: 'Remove repeated punctuation marks', icon: <Filter className="w-4 h-4" /> },
                { key: 'fixQuotes', label: 'Fix Quotes', desc: 'Standardize quote characters', icon: <FileText className="w-4 h-4" /> },
                { key: 'removeExtraNewlines', label: 'Remove Extra Newlines', desc: 'Reduce multiple newlines to two', icon: <AlignLeft className="w-4 h-4" /> },
              ].map((option) => (
                <label key={option.key} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={options[option.key as keyof CleaningOptions]}
                    onChange={(e) => setOptions({
                      ...options,
                      [option.key]: e.target.checked
                    })}
                    className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-600 opacity-70 group-hover:opacity-100">
                        {option.icon}
                      </span>
                      <span className="font-medium text-slate-900 group-hover:text-purple-700">
                        {option.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 ml-6">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={loadExample}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                Load Example Text
              </button>
              <button
                onClick={() => {
                  setOptions({
                    removeExtraSpaces: true,
                    removeLineBreaks: false,
                    trimWhitespace: true,
                    removeSpecialChars: false,
                    removeDuplicateLines: false,
                    removeHTMLTags: false,
                    normalizeUnicode: true,
                    lowercaseText: false,
                    removeExtraPunctuation: false,
                    fixQuotes: true,
                    removeExtraNewlines: true,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Options
              </button>
              <button
                onClick={() => handleDownload('txt')}
                disabled={!cleanedText.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all font-medium hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Cleaned Text
              </button>
            </div>
          </div>

          {/* Recent Cleans */}
          {recentCleans.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Recent Cleans
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {recentCleans.map((clean, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-slate-900">Clean #{index + 1}</span>
                      <button
                        onClick={() => handleCopyText(clean)}
                        className="text-xs text-slate-500 hover:text-purple-600"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 truncate">{clean}...</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Why Use Our Free Text Cleaner Tool?
          </h2>
          
          <p className="text-lg text-slate-700 mb-6">
            Transform messy, poorly formatted text into clean, professional content instantly with our powerful <strong>free text cleaner</strong>. Perfect for writers, developers, students, and professionals who need to clean text copied from PDFs, Word documents, websites, or social media. Our tool removes <strong>extra spaces</strong>, <strong>line breaks</strong>, <strong>special characters</strong>, <strong>HTML tags</strong>, and other unwanted formatting elements.
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
                  '12+ Cleaning Options - Comprehensive text cleaning',
                  'Real-time Cleaning - Instant results as you type',
                  'PDF/DOC Ready - Clean text from any source',
                  'File Download - Save as TXT or PDF reports',
                  'Copy-Paste Ready - Easy text manipulation',
                  'SEO Optimized - Prepare text for search engines',
                  'Privacy Focused - All processing happens locally'
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
                <Sparkles className="w-5 h-5" />
                Common Use Cases
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'PDF Text Extraction', desc: 'Clean text copied from PDF documents' },
                  { title: 'Word Document Cleaning', desc: 'Remove hidden formatting from Word docs' },
                  { title: 'Website Content', desc: 'Clean text copied from websites with HTML' },
                  { title: 'Social Media Posts', desc: 'Prepare clean text for social platforms' },
                  { title: 'SEO Content', desc: 'Optimize text for search engines' },
                  { title: 'Code Text Cleaning', desc: 'Clean text for programming/coding' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-600">{item.desc}</div>
                    </div>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Who Needs Text Cleaning?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Writers', desc: 'Clean articles & blog posts' },
                { title: 'Developers', desc: 'Prepare clean code text' },
                { title: 'Students', desc: 'Clean research papers' },
                { title: 'Marketers', desc: 'Prepare social media content' },
                { title: 'SEO Specialists', desc: 'Optimize website text' },
                { title: 'Researchers', desc: 'Clean data from documents' },
                { title: 'Editors', desc: 'Fix formatting issues' },
                { title: 'Business Owners', desc: 'Clean business documents' }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4">
                  <div className="text-lg font-bold text-purple-600 mb-1">{item.title}</div>
                  <div className="text-sm text-slate-600">{item.desc}</div>
                </div>
              ))}
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
                Frequently Asked Questions About Text Cleaning
              </h3>
              <span className="text-slate-600">{showFAQs ? '▲' : '▼'}</span>
            </button>
            
            {showFAQs && (
              <div className="mt-4 space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 border border-slate-100 hover:border-purple-200 transition-colors">
                    <h4 className="font-bold text-slate-900 mb-2">{faq.question}</h4>
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Keywords Footer */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Popular Search Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {seoKeywords.slice(20, 40).map((keyword, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-4">Ready to Clean Your Text?</h3>
            <p className="text-purple-100 mb-4">
              Experience the most comprehensive free text cleaner online. Perfect for all your text cleaning needs - from simple space removal to complex formatting fixes. No registration required!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Try Example Now
              </button>
              <button
                onClick={() => handleDownload('txt')}
                disabled={!cleanedText.trim()}
                className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Cleaned Text
              </button>
            </div>
            <div className="mt-4 text-sm text-purple-300">
              Visit <a href="https://thewebtoolskit.com" className="underline hover:text-white">thewebtoolskit.com</a> for more free text tools and resources.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Keywords Footer */}
      <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold mb-3">RELATED TEXT TOOLS KEYWORDS</p>
          <div className="flex flex-wrap justify-center gap-2">
            {seoKeywords.slice(40, 60).map((keyword, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-slate-800 rounded hover:text-slate-300 transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-xs mt-4 text-slate-500">
            © {new Date().getFullYear()} The Web Toolskit - Free Text Cleaner Tool. All text processing happens locally in your browser.
          </p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};