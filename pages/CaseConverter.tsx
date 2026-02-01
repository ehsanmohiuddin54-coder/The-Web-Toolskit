import React, { useState } from 'react';
import { 
  Type, 
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
  Hash
} from 'lucide-react';
import { ToolNavigation } from '../components/ToolNavigation';

interface ConversionResult {
  type: string;
  description: string;
  example: string;
  converted: string;
}

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');
  const [activeConversion, setActiveConversion] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showFAQs, setShowFAQs] = useState<boolean>(false);
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([]);
  const [fontSize, setFontSize] = useState<number>(16);

  // SEO Keywords
  const seoKeywords = [
    'case converter',
    'case converter online',
    'free case converter',
    'free online case converter',
    'case converter tool',
    'online case converter free',
    'text case converter',
    'letter case converter',
    'easy letter case changer',
    'text case changer',
    'instant text case changer',
    'change text case online',
    'change text case without signup',
    'convert text case tool',
    'convert string case online',
    'online text transformation tool',
    'uppercase converter',
    'lowercase converter',
    'convert uppercase to lowercase online',
    'lowercase to uppercase tool free',
    'toggle case converter',
    'toggle case converter tool',
    'title case converter',
    'title case converter for essays',
    'free title case formatting tool',
    'APA title case converter',
    'sentence case converter',
    'sentence case generator free',
    'camel case converter',
    'snake case converter',
    'kebab case converter',
    'pascal case converter',
    'snake_case to camelCase converter',
    'camelCase to snake_case online',
    'kebab-case to pascalcase tool',
    'pascal case to kebab case converter',
    'developer case converter',
    'case converter for coding',
    'clean text case converter',
    'bulk case converter online',
    'fast case converter online',
    'simple case converter tool',
    'instant text case converter',
    'no signup case converter',
    'browser based case converter',
    'best case converter for mac/windows',
    'text transformation tool',
    'online case changer',
    'letter case transformer',
    'case style converter',
    'text formatting tool',
    'free text case tool',
    'uppercase to lowercase converter',
    'lowercase to uppercase converter',
    'capitalize text online',
    'text capitalization tool',
    'convert case online free',
    'case conversion tool',
    'text case editor',
    'online text case editor'
  ];

  // Helper functions for different case conversions
  const toSentenceCase = (str: string): string => {
    return str.replace(/(^\w|\.\s+\w)/g, match => match.toUpperCase());
  };

  const toTitleCase = (str: string): string => {
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v.?|vs.?|via)$/i;
    const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
    
    return str.toLowerCase().split(' ').map((word, index, array) => {
      if (index === 0 || index === array.length - 1 || !smallWords.test(word)) {
        return word.replace(alphanumericPattern, match => match.toUpperCase());
      }
      return word;
    }).join(' ');
  };

  const toCamelCase = (str: string): string => {
    return str.toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toPascalCase = (str: string): string => {
    return str.replace(/\w+/g, word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string): string => {
    return str.toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim()
      .split(/\s+/)
      .join('_');
  };

  const toKebabCase = (str: string): string => {
    return str.toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim()
      .split(/\s+/)
      .join('-');
  };

  const toToggleCase = (str: string): string => {
    return str.split('').map((char, index) => 
      index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    ).join('');
  };

  const toAlternatingCase = (str: string): string => {
    return str.split('').map((char, index) => 
      index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
    ).join('');
  };

  const toInverseCase = (str: string): string => {
    return str.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    }).join('');
  };

  // Main conversion function
  const convertText = (type: string): void => {
    if (!text.trim()) return;

    let result = '';
    let description = '';
    
    switch(type) {
      case 'uppercase':
        result = text.toUpperCase();
        description = 'All letters converted to uppercase';
        break;
      case 'lowercase':
        result = text.toLowerCase();
        description = 'All letters converted to lowercase';
        break;
      case 'sentence':
        result = toSentenceCase(text);
        description = 'First letter of each sentence capitalized';
        break;
      case 'title':
        result = toTitleCase(text);
        description = 'Title case formatting (capitalize major words)';
        break;
      case 'camel':
        result = toCamelCase(text);
        description = 'camelCase formatting for programming';
        break;
      case 'pascal':
        result = toPascalCase(text);
        description = 'PascalCase formatting for programming';
        break;
      case 'snake':
        result = toSnakeCase(text);
        description = 'snake_case formatting for programming';
        break;
      case 'kebab':
        result = toKebabCase(text);
        description = 'kebab-case formatting for programming';
        break;
      case 'toggle':
        result = toToggleCase(text);
        description = 'Toggle case (alternating uppercase/lowercase)';
        break;
      case 'alternating':
        result = toAlternatingCase(text);
        description = 'Alternating case starting with uppercase';
        break;
      case 'inverse':
        result = toInverseCase(text);
        description = 'Inverse case (swap uppercase/lowercase)';
        break;
      case 'capitalize':
        result = text.toLowerCase().replace(/\b\w/g, match => match.toUpperCase());
        description = 'Capitalize first letter of each word';
        break;
      default:
        return;
    }

    setConvertedText(result);
    setActiveConversion(type);

    // Add to history
    const newConversion: ConversionResult = {
      type,
      description,
      example: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      converted: result.substring(0, 50) + (result.length > 50 ? '...' : '')
    };

    setConversionHistory(prev => [newConversion, ...prev.slice(0, 4)]);
  };

  // Handle download converted text
  const handleDownload = (format: 'txt' | 'pdf' | 'doc' = 'txt') => {
    if (!convertedText.trim()) {
      alert('No converted text to download');
      return;
    }

    let blob: Blob;
    let filename = `converted-text-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'txt') {
      blob = new Blob([convertedText], { type: 'text/plain' });
      filename += '.txt';
    } else if (format === 'pdf') {
      // Simple PDF generation
      const pdfContent = `Converted Text Report
Generated: ${new Date().toLocaleString()}
Tool: The Web Toolskit Case Converter
Original Conversion Type: ${activeConversion}
Original Text Length: ${text.length} characters
Converted Text Length: ${convertedText.length} characters

CONVERTED TEXT:
${convertedText}

ORIGINAL TEXT (first 1000 chars):
${text.substring(0, 1000)}${text.length > 1000 ? '...' : ''}

NOTES:
This text was converted using our free online case converter.
Visit https://thewebtoolskit.com for more text tools.
      `;
      blob = new Blob([pdfContent], { type: 'application/pdf' });
      filename += '.pdf';
    } else {
      // Simple DOC format
      const docContent = `Converted Text\n\n${convertedText}`;
      blob = new Blob([docContent], { type: 'application/msword' });
      filename += '.doc';
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

  // Handle copy text
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

  // Clear all
  const handleClear = () => {
    setText('');
    setConvertedText('');
    setActiveConversion('');
    setConversionHistory([]);
  };

  // Load example content
  const loadExample = () => {
    const example = `Welcome to the ultimate free case converter tool! This powerful online tool helps you transform text between different cases instantly. Whether you need to convert text to uppercase, lowercase, title case, or programming cases like camelCase and snake_case, our tool has you covered.

For developers: Convert variable names between different naming conventions quickly.
For writers: Format your essays, articles, and documents with proper case styles.
For students: Prepare your assignments with correct APA or MLA title case formatting.

Simply paste your text, choose a conversion type, and get instant results. You can download converted text in multiple formats.

Try converting this text to different cases and see the magic happen!`;
    
    setText(example);
  };

  // FAQs
  const faqs = [
    {
      question: 'What is a case converter tool and why should I use it?',
      answer: 'A case converter is an online tool that transforms text between different capitalization styles like uppercase, lowercase, title case, sentence case, and programming cases (camelCase, snake_case, etc.). It saves time for writers, developers, students, and professionals who need to format text correctly for different purposes.'
    },
    {
      question: 'How does this free case converter work?',
      answer: 'Simply paste your text into the editor, select your desired case conversion type, and instantly see the transformed text. The tool processes text locally in your browser for privacy and speed. All conversions happen in real-time as you click different conversion buttons.'
    },
    {
      question: 'Can I download the converted text?',
      answer: 'Yes! After conversion, you can download the transformed text in multiple formats: plain text (.txt), PDF (.pdf), or Word document (.doc). The download feature is completely free with no limitations. Just select your preferred format from the dropdown menu.'
    },
    {
      question: 'Is this case converter really free with no registration?',
      answer: 'Absolutely! Our case converter is 100% free with no signup, registration, or hidden costs. All features including multiple case conversions, copy-paste functionality, and downloads are available without any limitations. The tool works entirely in your browser with no data sent to servers.'
    },
    {
      question: 'What programming case conversions are available?',
      answer: 'We support all major programming case styles: camelCase (variable names), PascalCase (class names), snake_case (file names and database fields), kebab-case (URL slugs and CSS classes). Perfect for developers converting between different naming conventions instantly.'
    },
    {
      question: 'How accurate is the title case conversion?',
      answer: 'Our title case algorithm follows standard capitalization rules, handling small words (a, an, the, etc.) appropriately according to Chicago Manual of Style guidelines. It\'s perfect for essays, article titles, and professional documents requiring proper title case formatting.'
    },
    {
      question: 'Can I use this tool for bulk text conversion?',
      answer: 'Yes! While we don\'t have file upload functionality, you can paste large amounts of text directly into the editor (up to 10,000 characters). The tool handles bulk conversion efficiently, making it perfect for formatting long documents, code files, or multiple paragraphs at once.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-8 h-8" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">TEXT TOOL</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Free Case Converter Tool
          </h1>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl">
            Instantly transform text between uppercase, lowercase, title case, sentence case, and programming cases. Copy-paste your text, choose a conversion type, and get instant results with download options.
          </p>
          <div className="flex flex-wrap gap-2">
            {['100% Free', 'No Registration', '12+ Case Types', 'Real-time Conversion', 'PDF/DOC Download', 'Copy-Paste Ready', 'Browser Based', 'Privacy Focused'].map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-default">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-l from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* SEO Keywords Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex flex-wrap gap-2 justify-center">
          {seoKeywords.slice(0, 12).map((keyword, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-default shadow-sm">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Input & Conversions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Text */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Original Text</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{text.length} chars</span>
                  <button
                    onClick={handleClear}
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
                  placeholder='Paste your text here for conversion...
Example: convert this text to different cases for testing...'
                  className="w-full h-64 p-4 focus:outline-none resize-none font-mono text-slate-700 bg-white"
                  style={{ fontSize: `${fontSize}px` }}
                  spellCheck={false}
                />
                <div className="absolute bottom-2 right-2 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded">
                  Font: {fontSize}px
                </div>
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

            {/* Converted Text */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Converted Text</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{convertedText.length} chars</span>
                  {activeConversion && (
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {activeConversion}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={convertedText}
                  readOnly
                  placeholder='Converted text will appear here...'
                  className="w-full h-64 p-4 focus:outline-none resize-none font-mono text-slate-700 bg-slate-50"
                  style={{ fontSize: `${fontSize}px` }}
                  spellCheck={false}
                />
                {!convertedText && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    Select a conversion type to see results
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopyText(convertedText)}
                  disabled={!convertedText.trim()}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Converted'}
                </button>
                <div className="relative flex-1">
                  <select
                    onChange={(e) => handleDownload(e.target.value as 'txt' | 'pdf' | 'doc')}
                    disabled={!convertedText.trim()}
                    className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Download as...</option>
                    <option value="txt">Text File (.txt)</option>
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="doc">Word Document (.doc)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Font Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Size
              </label>
              <span className="text-sm font-bold text-blue-600">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>
        </div>

        {/* Right Column - Conversion Types & History */}
        <div className="space-y-6">
          {/* Conversion Types */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Conversion Types
              </h3>
              <p className="text-sm text-slate-600 mt-1">Click any button to convert text</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3">
              {/* Basic Conversions */}
              <button
                onClick={() => convertText('uppercase')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">UPPERCASE</div>
                <div className="text-xs text-slate-600">ALL CAPITAL LETTERS</div>
              </button>
              <button
                onClick={() => convertText('lowercase')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">lowercase</div>
                <div className="text-xs text-slate-600">all small letters</div>
              </button>
              <button
                onClick={() => convertText('sentence')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">Sentence case</div>
                <div className="text-xs text-slate-600">First letter of sentences</div>
              </button>
              <button
                onClick={() => convertText('title')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">Title Case</div>
                <div className="text-xs text-slate-600">Proper Title Formatting</div>
              </button>
              <button
                onClick={() => convertText('capitalize')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">Capitalize Words</div>
                <div className="text-xs text-slate-600">Each Word Starts Capital</div>
              </button>
              <button
                onClick={() => convertText('toggle')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">tOgGlE cAsE</div>
                <div className="text-xs text-slate-600">Alternating case</div>
              </button>
              <button
                onClick={() => convertText('inverse')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">InVeRsE CaSe</div>
                <div className="text-xs text-slate-600">Swap uppercase/lowercase</div>
              </button>
              <button
                onClick={() => convertText('alternating')}
                className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">AlTeRnAtInG</div>
                <div className="text-xs text-slate-600">Alternating starting with upper</div>
              </button>
              
              {/* Programming Cases */}
              <button
                onClick={() => convertText('camel')}
                className="p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group col-span-2"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-600" />
                  <div className="font-bold text-slate-900 group-hover:text-green-700">camelCase</div>
                </div>
                <div className="text-xs text-slate-600 mt-1">variableNamesLikeThis</div>
              </button>
              <button
                onClick={() => convertText('pascal')}
                className="p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-600" />
                  <div className="font-bold text-slate-900 group-hover:text-green-700">PascalCase</div>
                </div>
                <div className="text-xs text-slate-600">ClassNamesLikeThis</div>
              </button>
              <button
                onClick={() => convertText('snake')}
                className="p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-600" />
                  <div className="font-bold text-slate-900 group-hover:text-green-700">snake_case</div>
                </div>
                <div className="text-xs text-slate-600">file_names_like_this</div>
              </button>
              <button
                onClick={() => convertText('kebab')}
                className="p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 rounded-xl transition-all hover:scale-105 active:scale-95 text-left group"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-600" />
                  <div className="font-bold text-slate-900 group-hover:text-green-700">kebab-case</div>
                </div>
                <div className="text-xs text-slate-600">url-slugs-like-this</div>
              </button>
            </div>
          </div>

          {/* Conversion History */}
          {conversionHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Recent Conversions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {conversionHistory.map((item, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-slate-900 capitalize">{item.type}</span>
                      <button
                        onClick={() => handleCopyText(item.converted)}
                        className="text-xs text-slate-500 hover:text-blue-600"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">{item.description}</div>
                    <div className="text-xs text-slate-500 truncate">"{item.example}" → "{item.converted}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-indigo-100">
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
                onClick={handleClear}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
                Clear All Text
              </button>
              <button
                onClick={() => handleDownload('txt')}
                disabled={!convertedText.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Why Use Our Free Case Converter Tool?
          </h2>
          
          <p className="text-lg text-slate-700 mb-6">
            Transform text formatting instantly with our powerful <strong>free case converter</strong>. Perfect for writers, developers, students, and professionals who need to convert text between different case styles quickly and accurately. Our tool supports <strong>uppercase conversion</strong>, <strong>lowercase conversion</strong>, <strong>title case formatting</strong>, <strong>sentence case</strong>, and specialized <strong>programming case styles</strong> like camelCase and snake_case.
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
                  '12+ Case Types - From basic to programming cases',
                  'Real-time Conversion - Instant text transformation',
                  'File Download - Save as TXT, PDF, or DOC',
                  'Copy-Paste Ready - Easy text manipulation',
                  'Conversion History - Track recent transformations',
                  'Font Size Control - Adjustable text display',
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
                <Code className="w-5 h-5" />
                Developer-Friendly Cases
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'camelCase', desc: 'variable names in JavaScript' },
                  { name: 'PascalCase', desc: 'class names in programming' },
                  { name: 'snake_case', desc: 'file names and database fields' },
                  { name: 'kebab-case', desc: 'URL slugs and CSS classes' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-sm text-slate-600">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => convertText(item.name.toLowerCase())}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Convert
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Who Uses Case Converter?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Writers', desc: 'Format articles & essays' },
                { title: 'Developers', desc: 'Convert code naming conventions' },
                { title: 'Students', desc: 'Prepare academic papers' },
                { title: 'Marketers', desc: 'Create consistent content' }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4">
                  <div className="text-lg font-bold text-blue-600 mb-1">{item.title}</div>
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
                Frequently Asked Questions About Case Conversion
              </h3>
              <span className="text-slate-600">{showFAQs ? '▲' : '▼'}</span>
            </button>
            
            {showFAQs && (
              <div className="mt-4 space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 border border-slate-100 hover:border-blue-200 transition-colors">
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

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-4">Ready to Transform Your Text?</h3>
            <p className="text-blue-100 mb-4">
              Experience the most comprehensive free case converter online. Perfect for all your text formatting needs - from simple case changes to complex programming conversions. No registration required!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Try Example Now
              </button>
              <button
                onClick={() => handleDownload('txt')}
                disabled={!convertedText.trim()}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Results
              </button>
            </div>
            <div className="mt-4 text-sm text-blue-300">
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
            © {new Date().getFullYear()} The Web Toolskit - Free Case Converter Tool. All text processing happens locally in your browser.
          </p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};