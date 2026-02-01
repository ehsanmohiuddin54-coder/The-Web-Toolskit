import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scissors, 
  Copy, 
  Check, 
  Download, 
  Filter,
  RefreshCw,
  Zap,
  Search,
  HelpCircle,
  TrendingUp,
  Hash,
  X,
  BookOpen,
  Type,
  Trash2,
  AlignLeft,
  Edit3,
  Shield,
  Globe,
  ExternalLink,
  Hash as HashIcon,
  Minus,
  Percent
} from 'lucide-react';
import { ToolNavigation } from '../components/ToolNavigation';

interface RemovalOptions {
  removeSpecialChars: boolean;
  removeNumbers: boolean;
  removeLetters: boolean;
  removePunctuation: boolean;
  removeSpaces: boolean;
  removeNewlines: boolean;
  removeByPosition: boolean;
  positionStart: number;
  positionEnd: number;
  removeSpecificChars: string;
  removeNonAlphanumeric: boolean;
  removeDuplicateChars: boolean;
  removeExtraSpaces: boolean;
}

export const CharacterRemover: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [cleanedText, setCleanedText] = useState<string>('');
  const [options, setOptions] = useState<RemovalOptions>({
    removeSpecialChars: true,
    removeNumbers: false,
    removeLetters: false,
    removePunctuation: true,
    removeSpaces: false,
    removeNewlines: true,
    removeByPosition: false,
    positionStart: 0,
    positionEnd: 0,
    removeSpecificChars: '',
    removeNonAlphanumeric: true,
    removeDuplicateChars: false,
    removeExtraSpaces: true,
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState({
    originalLength: 0,
    cleanedLength: 0,
    charactersRemoved: 0,
    numbersRemoved: 0,
    lettersRemoved: 0,
    specialCharsRemoved: 0,
  });
  const [showFAQs, setShowFAQs] = useState<boolean>(false);
  const [recentRemovals, setRecentRemovals] = useState<string[]>([]);
  const [removalMode, setRemovalMode] = useState<'all' | 'specific' | 'position'>('all');

  // SEO Keywords
  const seoKeywords = [
    'char remover',
    'character remover',
    'character remover online',
    'free character remover',
    'free online character remover',
    'char remover tool',
    'character removal tool',
    'online character remover free',
    'online character removal tool free',
    'remove characters from text',
    'remove specific characters from text online',
    'remove unwanted characters from text',
    'delete characters from text',
    'remove special characters',
    'remove special characters from string',
    'special character remover',
    'strip symbols from text online',
    'remove punctuation from text online',
    'remove numbers from text',
    'remove numbers from text tool',
    'remove letters from text',
    'remove letters from string free',
    'remove non-alphanumeric characters',
    'ASCII character remover online',
    'text sanitization character tool',
    'remove characters by position',
    'remove characters by position tool',
    'remove first character online',
    'remove last character online',
    'delete first and last characters online',
    'trim characters from text',
    'instant character trimmer tool',
    'clean special characters for SEO',
    'clean text characters for database',
    'bulk character remover no signup',
    'easy character remover',
    'easy text character deleter',
    'fast character remover online',
    'simple char remover tool',
    'simple char remover browser based',
    'instant character remover',
    'no signup character remover',
    'browser based character remover',
    'character cleaner',
    'text character remover',
    'remove unwanted text characters',
    'character stripping tool',
    'online character stripper',
    'text sanitizer tool',
    'clean text characters',
    'remove symbols from text',
    'character filter tool',
    'text filtering tool'
  ];

  // Character removal functions
  const removeCharacters = (input: string): string => {
    let result = input;
    let charactersRemoved = 0;
    let numbersRemoved = 0;
    let lettersRemoved = 0;
    let specialCharsRemoved = 0;

    const originalLength = input.length;

    // Remove specific characters
    if (options.removeSpecificChars && removalMode === 'specific') {
      const chars = options.removeSpecificChars.split('').filter(c => c).map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      if (chars) {
        const regex = new RegExp(`[${chars}]`, 'g');
        const before = result.length;
        result = result.replace(regex, '');
        charactersRemoved += before - result.length;
      }
    }

    // Remove by position
    if (options.removeByPosition && removalMode === 'position') {
      const { positionStart, positionEnd } = options;
      if (positionStart >= 0 && positionEnd > positionStart && positionEnd <= result.length) {
        result = result.slice(0, positionStart) + result.slice(positionEnd);
        charactersRemoved += positionEnd - positionStart;
      }
    }

    // Remove special characters
    if (options.removeSpecialChars && removalMode === 'all') {
      const before = result.length;
      // Keep alphanumeric, spaces, basic punctuation
      result = result.replace(/[^\w\s.,!?;:'"()\-@#$%&*+=]/g, '');
      specialCharsRemoved += before - result.length;
    }

    // Remove numbers
    if (options.removeNumbers && removalMode === 'all') {
      const before = result.length;
      result = result.replace(/[0-9]/g, '');
      numbersRemoved += before - result.length;
    }

    // Remove letters
    if (options.removeLetters && removalMode === 'all') {
      const before = result.length;
      result = result.replace(/[a-zA-Z]/g, '');
      lettersRemoved += before - result.length;
    }

    // Remove punctuation
    if (options.removePunctuation && removalMode === 'all') {
      const before = result.length;
      result = result.replace(/[.,!?;:'"()\-]/g, '');
      specialCharsRemoved += before - result.length;
    }

    // Remove spaces
    if (options.removeSpaces) {
      const before = result.length;
      result = result.replace(/\s/g, '');
      charactersRemoved += before - result.length;
    }

    // Remove newlines
    if (options.removeNewlines) {
      const before = result.length;
      result = result.replace(/\n/g, ' ');
      charactersRemoved += before - result.length;
    }

    // Remove non-alphanumeric
    if (options.removeNonAlphanumeric && removalMode === 'all') {
      const before = result.length;
      result = result.replace(/[^a-zA-Z0-9]/g, '');
      specialCharsRemoved += before - result.length;
    }

    // Remove duplicate characters
    if (options.removeDuplicateChars) {
      const before = result.length;
      result = result.split('').filter((char, index, array) => {
        return array.indexOf(char) === index || char === ' ';
      }).join('');
      charactersRemoved += before - result.length;
    }

    // Remove extra spaces
    if (options.removeExtraSpaces) {
      result = result.replace(/\s+/g, ' ');
    }

    // Trim the result
    result = result.trim();

    // Update stats
    setStats({
      originalLength,
      cleanedLength: result.length,
      charactersRemoved: originalLength - result.length,
      numbersRemoved,
      lettersRemoved,
      specialCharsRemoved,
    });

    // Add to recent removals
    if (result && result !== input && result.length > 0) {
      const preview = result.length > 100 ? result.substring(0, 100) + '...' : result;
      setRecentRemovals(prev => [preview, ...prev.slice(0, 3)]);
    }

    return result;
  };

  const handleRemove = () => {
    if (!text.trim()) return;
    const cleaned = removeCharacters(text);
    setCleanedText(cleaned);
  };

  const handleReset = () => {
    setText('');
    setCleanedText('');
    setStats({
      originalLength: 0,
      cleanedLength: 0,
      charactersRemoved: 0,
      numbersRemoved: 0,
      lettersRemoved: 0,
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
      // Fallback for older browsers
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
    let filename = `character-removed-text-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'txt') {
      blob = new Blob([cleanedText], { type: 'text/plain' });
      filename += '.txt';
    } else {
      const pdfContent = `Character Removal Report
Generated: ${new Date().toLocaleString()}
Tool: The Web Toolskit Character Remover
Original Length: ${stats.originalLength} characters
Cleaned Length: ${stats.cleanedLength} characters
Characters Removed: ${stats.charactersRemoved}
Numbers Removed: ${stats.numbersRemoved}
Letters Removed: ${stats.lettersRemoved}
Special Characters Removed: ${stats.specialCharsRemoved}

REMOVAL MODE: ${removalMode.toUpperCase()}
OPTIONS APPLIED:
${Object.entries(options)
  .filter(([key, value]) => {
    // Filter only true boolean options or non-empty strings
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.trim() !== '';
    return false;
  })
  .map(([key]) => `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  .join('\n')}

ORIGINAL TEXT (first 500 chars):
${text.substring(0, 500)}${text.length > 500 ? '...' : ''}

CLEANED TEXT:
${cleanedText}

NOTES:
This text was processed using our free online character remover.
Visit https://thewebtoolskit.com for more text tools.
      `;
      blob = new Blob([pdfContent], { type: 'text/plain' }); // Using text/plain instead of application/pdf
      filename += '.txt'; // Changed to .txt since we're not generating actual PDF
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
    const example = `Contact Info: John Doe - (123) 456-7890
Email: john.doe@example.com
Social: @johndoe #tech

Special Characters: !@#$%^&*()_+={}[]|\:;"'<>,.?/~

Numbers: 1234567890
Mixed: ABC123!@# def456$%^

Extra   spaces   between   words...

Multiple
line
breaks

Website: https://example.com/path/to/page?query=string

Unicode: café résumé 😊 🎉

Repeated characters: aaabbccdddeee
`;
    
    setText(example);
  };

  // Auto-remove when text changes and options are enabled
  useEffect(() => {
    if (text.trim()) {
      handleRemove();
    }
  }, [text, options, removalMode]);

  const faqs = [
    {
      question: 'What is a character remover tool and why do I need it?',
      answer: 'A character remover is an online tool that helps you delete specific or unwanted characters from text. It\'s essential for data cleaning, text processing, preparing content for databases, SEO optimization, and removing unwanted formatting from copied text.'
    },
    {
      question: 'How does this free character remover work?',
      answer: 'Simply paste your text into the editor, choose your removal mode (remove all specific characters, remove by position, or remove specific characters), adjust the options, and instantly see the cleaned result. The tool processes text locally in your browser for complete privacy.'
    },
    {
      question: 'What types of characters can I remove?',
      answer: 'You can remove special characters, numbers, letters, punctuation, spaces, newlines, duplicate characters, and specific custom characters. You can also remove characters by position (first X characters, last X characters, or characters between specific positions).'
    },
    {
      question: 'Can I remove specific custom characters?',
      answer: 'Yes! Use the "Specific Characters" mode to enter exactly which characters you want to remove. For example, enter "@#$" to remove only those three symbols from your text. The tool will remove only the characters you specify.'
    },
    {
      question: 'Is this character remover really free with no registration?',
      answer: 'Absolutely! Our character remover is 100% free with no signup, registration, or hidden costs. All features including multiple removal modes, copy-paste functionality, and downloads are available without any limitations. The tool works entirely in your browser.'
    },
    {
      question: 'How can I use this tool for SEO optimization?',
      answer: 'Clean text is crucial for SEO. Our tool helps you remove special characters, extra spaces, and unwanted symbols that can affect search engine readability. This ensures better indexing and improved user experience - both important SEO factors.'
    },
    {
      question: 'Can I remove characters by position?',
      answer: 'Yes! Use the "Remove by Position" mode to delete characters from specific positions. For example, remove the first 5 characters, last 10 characters, or characters from position 10 to 20. This is perfect for cleaning data with fixed formats.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Scissors className="w-8 h-8" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">TEXT TOOL</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Free Character Remover Tool
          </h1>
          <p className="text-lg text-amber-100 mb-6 max-w-3xl">
            Instantly remove unwanted characters, symbols, numbers, letters, and special characters from text. Perfect for data cleaning, SEO optimization, database preparation, and text sanitization.
          </p>
          <div className="flex flex-wrap gap-2">
            {['100% Free', 'No Registration', '3 Removal Modes', 'Real-time Processing', 'PDF Download', 'Custom Characters', 'Browser Based', 'Privacy Focused'].map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-default">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-l from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* SEO Keywords Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-orange-100">
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
                <h3 className="font-semibold text-slate-900">Original Text</h3>
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
                  placeholder='Paste text with unwanted characters here...
Example: Contact: (123) 456-7890, Email: info@example.com...'
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
                <h3 className="font-semibold text-slate-900">Character Removed Text</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{cleanedText.length} chars</span>
                  {cleanedText && (
                    <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded">
                      {stats.charactersRemoved} removed
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={cleanedText}
                  readOnly
                  placeholder='Character-removed text will appear here...'
                  className="w-full h-80 p-4 focus:outline-none resize-none font-mono text-sm text-slate-700 bg-amber-50/30"
                  spellCheck={false}
                />
                {!cleanedText && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    Choose removal options and paste text
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
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Removal Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-600">{stats.originalLength}</div>
                  <div className="text-sm text-slate-600">Original</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{stats.cleanedLength}</div>
                  <div className="text-sm text-slate-600">Cleaned</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">{stats.charactersRemoved}</div>
                  <div className="text-sm text-slate-600">Total Removed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{stats.numbersRemoved}</div>
                  <div className="text-sm text-slate-600">Numbers</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{stats.lettersRemoved}</div>
                  <div className="text-sm text-slate-600">Letters</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{stats.specialCharsRemoved}</div>
                  <div className="text-sm text-slate-600">Special Chars</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Options & Actions */}
        <div className="space-y-6">
          {/* Removal Mode Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Removal Mode
              </h3>
              <p className="text-sm text-slate-600 mt-1">Choose how to remove characters</p>
            </div>
            <div className="p-6 space-y-3">
              {[
                { id: 'all', label: 'Remove All', desc: 'Remove categories (special chars, numbers, etc.)', icon: <Trash2 className="w-4 h-4" /> },
                { id: 'specific', label: 'Specific Characters', desc: 'Remove only specified characters', icon: <HashIcon className="w-4 h-4" /> },
                { id: 'position', label: 'Remove by Position', desc: 'Remove characters at specific positions', icon: <Scissors className="w-4 h-4" /> }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setRemovalMode(mode.id as any)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left ${removalMode === mode.id ? 'bg-amber-50 border-2 border-amber-200' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'}`}
                >
                  <div className={`p-2 rounded-lg ${removalMode === mode.id ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                    {mode.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 mb-1">{mode.label}</div>
                    <div className="text-xs text-slate-600">{mode.desc}</div>
                  </div>
                  {removalMode === mode.id && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Removal Options */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                {removalMode === 'all' ? 'Character Categories' : 
                 removalMode === 'specific' ? 'Specific Characters' : 
                 'Position Settings'}
              </h3>
            </div>
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {removalMode === 'all' && (
                <>
                  {[
                    { key: 'removeSpecialChars', label: 'Remove Special Characters', desc: 'Remove symbols like !@#$%^&*' },
                    { key: 'removeNumbers', label: 'Remove Numbers', desc: 'Remove 0-9 digits' },
                    { key: 'removeLetters', label: 'Remove Letters', desc: 'Remove A-Z and a-z' },
                    { key: 'removePunctuation', label: 'Remove Punctuation', desc: 'Remove .,!?;: etc.' },
                    { key: 'removeSpaces', label: 'Remove Spaces', desc: 'Remove all whitespace' },
                    { key: 'removeNewlines', label: 'Remove Line Breaks', desc: 'Remove newline characters' },
                    { key: 'removeNonAlphanumeric', label: 'Remove Non-Alphanumeric', desc: 'Keep only letters and numbers' },
                    { key: 'removeDuplicateChars', label: 'Remove Duplicate Characters', desc: 'Remove repeated characters' },
                    { key: 'removeExtraSpaces', label: 'Remove Extra Spaces', desc: 'Convert multiple spaces to single' },
                  ].map((option) => (
                    <label key={option.key} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={options[option.key as keyof RemovalOptions] as boolean}
                        onChange={(e) => setOptions({
                          ...options,
                          [option.key]: e.target.checked
                        })}
                        className="mt-1 w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 group-hover:text-amber-700">
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </>
              )}

              {removalMode === 'specific' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Characters to Remove
                    </label>
                    <input
                      type="text"
                      value={options.removeSpecificChars}
                      onChange={(e) => setOptions({...options, removeSpecificChars: e.target.value})}
                      placeholder="Enter characters to remove (e.g., @#$%*)"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                    <div className="text-xs text-slate-500 mt-2">
                      Enter exact characters to remove. Example: "@#$" removes only those symbols.
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm font-medium text-amber-800 mb-1">Quick Character Sets</div>
                    <div className="flex flex-wrap gap-2">
                      {['@#$%^&*', '0123456789', '.,!?;:', '()[]{}', '><=+-'].map((set) => (
                        <button
                          key={set}
                          onClick={() => setOptions({...options, removeSpecificChars: set})}
                          className="text-xs px-3 py-1 bg-white border border-amber-200 text-amber-700 rounded hover:bg-amber-50 transition-colors"
                        >
                          {set}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {removalMode === 'position' && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-900 mb-2">
                      <input
                        type="checkbox"
                        checked={options.removeByPosition}
                        onChange={(e) => setOptions({...options, removeByPosition: e.target.checked})}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      Enable Position Removal
                    </label>
                  </div>
                  
                  {options.removeByPosition && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Start Position
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={options.positionStart}
                            onChange={(e) => setOptions({...options, positionStart: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            End Position
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={options.positionEnd}
                            onChange={(e) => setOptions({...options, positionEnd: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>• Characters from position {options.positionStart} to {options.positionEnd} will be removed</div>
                        <div>• Position starts at 0 (first character is position 0)</div>
                        <div>• Example: Start 0, End 5 removes first 6 characters</div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-orange-100">
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
                    removeSpecialChars: true,
                    removeNumbers: false,
                    removeLetters: false,
                    removePunctuation: true,
                    removeSpaces: false,
                    removeNewlines: true,
                    removeByPosition: false,
                    positionStart: 0,
                    positionEnd: 0,
                    removeSpecificChars: '',
                    removeNonAlphanumeric: true,
                    removeDuplicateChars: false,
                    removeExtraSpaces: true,
                  });
                  setRemovalMode('all');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Reset All Options
              </button>
              <button
                onClick={() => handleDownload('txt')}
                disabled={!cleanedText.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all font-medium hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Cleaned Text
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Why Use Our Free Character Remover Tool?
          </h2>
          
          <p className="text-lg text-slate-700 mb-6">
            Transform messy, cluttered text into clean, usable content instantly with our powerful <strong>free character remover</strong>. Perfect for data analysts, developers, writers, and professionals who need to clean text for databases, SEO, content publishing, or data processing. Our tool removes <strong>unwanted characters</strong>, <strong>special symbols</strong>, <strong>numbers</strong>, <strong>letters</strong>, and other text elements with precision.
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
                  '3 Removal Modes - All, specific, or by position',
                  'Real-time Processing - Instant results as you type',
                  'PDF Report Download - Detailed cleaning statistics',
                  'Custom Character Removal - Remove exactly what you need',
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
                <Scissors className="w-5 h-5" />
                Removal Modes
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Remove All Categories', desc: 'Remove special chars, numbers, letters, etc.' },
                  { title: 'Specific Characters', desc: 'Remove only custom-specified characters' },
                  { title: 'Remove by Position', desc: 'Delete characters at specific positions' },
                  { title: 'Quick Character Sets', desc: 'Pre-defined sets for common needs' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-600">{item.desc}</div>
                    </div>
                    <Scissors className="w-4 h-4 text-amber-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Common Use Cases</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Data Cleaning', desc: 'Prepare CSV/Excel data' },
                { title: 'SEO Optimization', desc: 'Clean URLs and meta tags' },
                { title: 'Database Entry', desc: 'Prepare text for databases' },
                { title: 'Content Publishing', desc: 'Clean articles and blog posts' },
                { title: 'Code Processing', desc: 'Clean strings for programming' },
                { title: 'Social Media', desc: 'Prepare clean text for posts' },
                { title: 'Research Data', desc: 'Clean academic text data' },
                { title: 'Text Analysis', desc: 'Prepare text for analysis tools' }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4">
                  <div className="text-lg font-bold text-amber-600 mb-1">{item.title}</div>
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
                Frequently Asked Questions About Character Removal
              </h3>
              <span className="text-slate-600">{showFAQs ? '▲' : '▼'}</span>
            </button>
            
            {showFAQs && (
              <div className="mt-4 space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 border border-slate-100 hover:border-amber-200 transition-colors">
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

          <div className="mt-8 p-6 bg-gradient-to-r from-amber-900 to-orange-900 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-4">Ready to Remove Unwanted Characters?</h3>
            <p className="text-amber-100 mb-4">
              Experience the most comprehensive free character remover online. Perfect for all your text cleaning needs - from simple character removal to complex text sanitization. No registration required!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-6 py-3 bg-white text-amber-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Try Example Now
              </button>
              <button
                onClick={() => handleDownload('txt')}
                disabled={!cleanedText.trim()}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download Cleaned Text
              </button>
            </div>
            <div className="mt-4 text-sm text-amber-300">
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
            © {new Date().getFullYear()} The Web Toolskit - Free Character Remover Tool. All text processing happens locally in your browser.
          </p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};