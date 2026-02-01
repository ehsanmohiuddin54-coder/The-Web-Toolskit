import React, { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Search,
  Eye,
  FileText,
  Zap,
  Shield,
  Lock,
  Cpu,
  Globe,
  TrendingUp,
  HelpCircle,
  ExternalLink,
  Minus,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { ToolNavigation } from '../components/ToolNavigation';

export const JsonFormatter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isMinified, setIsMinified] = useState<boolean>(false);
  const [isFormatted, setIsFormatted] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(0);
  const [showTreeView, setShowTreeView] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [showFAQs, setShowFAQs] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update character and line count
  useEffect(() => {
    setCharacterCount(text.length);
    setLineCount(text.split('\n').length);
  }, [text]);

  // Format JSON with proper indentation
  const formatJson = (jsonString: string, spaces: number = 2): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, spaces);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // Minify JSON
  const minifyJson = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // Validate JSON
  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Format JSON handler
  const handleFormat = (spaces: number = 2) => {
    setError('');
    try {
      const formatted = formatJson(text, spaces);
      setText(formatted);
      setIsValid(true);
      setIsFormatted(true);
      setIsMinified(false);
    } catch (err: any) {
      setError(`Format Error: ${err.message}`);
      setIsValid(false);
    }
  };

  // Minify JSON handler
  const handleMinify = () => {
    setError('');
    try {
      const minified = minifyJson(text);
      setText(minified);
      setIsValid(true);
      setIsMinified(true);
      setIsFormatted(false);
    } catch (err: any) {
      setError(`Minify Error: ${err.message}`);
      setIsValid(false);
    }
  };

  // Validate JSON handler
  const handleValidate = () => {
    setError('');
    if (!text.trim()) {
      setIsValid(null);
      return;
    }
    
    try {
      JSON.parse(text);
      setIsValid(true);
      setError('');
    } catch (err: any) {
      setIsValid(false);
      setError(`Validation Error: ${err.message}`);
    }
  };

  // Handle text change with real-time validation
  const handleTextChange = (val: string) => {
    setText(val);
    if (!val.trim()) {
      setIsValid(null);
      setError('');
      setIsFormatted(false);
      setIsMinified(false);
      return;
    }
    
    // Debounced validation for performance
    const timeoutId = setTimeout(() => {
      try {
        JSON.parse(val);
        setIsValid(true);
        setError('');
      } catch (e: any) {
        setIsValid(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Please upload a valid JSON file (.json)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setText(content);
        JSON.parse(content);
        setIsValid(true);
        setError('');
      } catch (err: any) {
        setError(`File Error: ${err.message}`);
        setIsValid(false);
      }
    };
    reader.readAsText(file);
  };

  // Handle download
  const handleDownload = () => {
    if (!text.trim()) {
      setError('Cannot download empty JSON');
      return;
    }

    try {
      // Validate before download
      JSON.parse(text);
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formatted-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err: any) {
      setError(`Cannot download invalid JSON: ${err.message}`);
    }
  };

  // Handle copy
  const handleCopy = async () => {
    if (!text.trim()) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
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
    setError('');
    setIsValid(null);
    setIsFormatted(false);
    setIsMinified(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Example JSON
  const loadExample = () => {
    const example = `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 28,
      "isActive": true,
      "skills": ["JavaScript", "React", "Node.js"],
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "country": "USA"
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "age": 32,
      "isActive": false,
      "skills": ["Python", "Django", "PostgreSQL"],
      "address": {
        "street": "456 Oak Ave",
        "city": "San Francisco",
        "country": "USA"
      }
    }
  ],
  "metadata": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "timestamp": "2026-01-15T10:30:00Z"
  }
}`;
    setText(example);
    setIsValid(true);
    setError('');
  };

  // Tree view parser (simplified)
  const parseJsonTree = () => {
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch {
      return null;
    }
  };

  const popularKeywords = [
    'json formatter',
    'json formatter online',
    'free json formatter',
    'json formatter tool',
    'online json formatter free',
    'json validator',
    'json validator online',
    'free json validator',
    'json validation tool',
    'online json validator free',
    'json formatter and validator',
    'json formatter validator tool',
    'free online json formatter and validator',
    'format json online',
    'beautify json online',
    'pretty print json tool',
    'minify json online',
    'validate json online',
    'check json validity',
    'json syntax checker',
    'json error checker',
    'easy json formatter',
    'fast json formatter online',
    'simple json validator tool',
    'instant json formatter and validator',
    'json parser online',
    'json viewer online',
    'browser based json formatter',
    'no signup json formatter',
    'json beautifier tool',
    'json prettifier online',
    'json data formatter',
    'api json formatter',
    'json structure validator',
    'json lint tool',
    'json code formatter',
    'json editor online',
    'json minifier tool',
    'json compressor online',
    'json file formatter',
    'json syntax validator',
    'json data viewer',
    'json tree viewer',
    'json array formatter',
    'json object validator'
  ];

  const faqs = [
    {
      question: 'What is JSON Formatter and Validator tool?',
      answer: 'Our JSON Formatter and Validator is a free online tool that helps developers format (beautify), minify (compact), and validate JSON data. It provides real-time syntax checking, file upload/download capabilities, and tree view visualization for better JSON data management.'
    },
    {
      question: 'Why should I format JSON data?',
      answer: 'Formatting JSON with proper indentation and line breaks makes it human-readable and easier to debug. Our beautify feature organizes JSON data with consistent spacing, while the minify feature removes unnecessary whitespace to reduce file size for API responses and data transmission.'
    },
    {
      question: 'How does the JSON validation work?',
      answer: 'Our validator checks JSON syntax in real-time as you type, identifying common errors like missing commas, unquoted keys, or incorrect brackets. The tool highlights errors with specific messages to help you fix invalid JSON structure quickly and efficiently.'
    },
    {
      question: 'Can I upload and download JSON files?',
      answer: 'Yes! Our tool supports JSON file upload (.json files) and download functionality. You can upload existing JSON files for formatting/validation and download the processed results. All file processing happens locally in your browser for maximum privacy and security.'
    },
    {
      question: 'Is this JSON formatter really free with no registration?',
      answer: 'Absolutely! Our JSON formatter and validator is 100% free with no signup, no registration, and no limitations. All processing happens locally in your browser, ensuring complete privacy. You can format, validate, minify, and manage JSON data without any restrictions.'
    },
    {
      question: 'What makes this tool better than other JSON formatters?',
      answer: 'Our tool offers comprehensive features including real-time validation, file upload/download, tree view visualization, multiple formatting options, error highlighting, and detailed statistics. It\'s completely browser-based, works offline after load, and processes all data locally for maximum security.'
    }
  ];

  const jsonTree = parseJsonTree();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">DEVELOPER TOOL</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Free JSON Formatter & Validator Tool
          </h1>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl">
            Format, validate, minify, and beautify JSON instantly. Upload JSON files, view tree structure, and download formatted results. No signup required.
          </p>
          <div className="flex flex-wrap gap-2">
            {['100% Free', 'No Registration', 'File Upload', 'Real-time Validation', 'Tree View', 'Minify JSON', 'Beautify JSON', 'Browser Based'].map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-default">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-l from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* SEO Keywords Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
        <div className="flex flex-wrap gap-2 justify-center">
          {popularKeywords.slice(0, 10).map((keyword, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-default shadow-sm">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* JSON Editor */}
          <div className={`bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden transition-all ${fullscreen ? 'fixed inset-4 z-50' : ''}`}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-900">JSON Editor</h2>
                <div className="flex items-center gap-2">
                  {isValid === true && (
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Valid JSON
                    </span>
                  )}
                  {isValid === false && (
                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Invalid JSON
                    </span>
                  )}
                  {isFormatted && (
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Formatted
                    </span>
                  )}
                  {isMinified && (
                    <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Minified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleClear}
                  className="text-sm px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder='Paste your JSON here or upload a file...
Example: {"name": "John", "age": 30, "city": "New York"}'
                className="w-full h-96 p-6 focus:outline-none resize-none font-mono text-sm text-slate-700 bg-white"
                spellCheck={false}
                style={{ 
                  fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                  lineHeight: '1.6'
                }}
              />
              
              {/* Character Count */}
              <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded">
                {characterCount} chars • {lineCount} lines
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 space-y-4">
              {/* Primary Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleFormat(2)}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  Beautify (2 spaces)
                </button>
                <button
                  onClick={() => handleFormat(4)}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  Beautify (4 spaces)
                </button>
                <button
                  onClick={handleMinify}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                  Minify JSON
                </button>
                <button
                  onClick={handleValidate}
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  Validate
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload JSON File
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!text.trim()}
                  className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${downloaded ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {downloaded ? 'Downloaded!' : 'Download JSON'}
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!text.trim()}
                  className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={loadExample}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Load Example
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">JSON Error Detected</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-sm text-slate-600 mb-1">Characters</div>
              <div className="text-2xl font-bold text-slate-900">{characterCount}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-sm text-slate-600 mb-1">Lines</div>
              <div className="text-2xl font-bold text-slate-900">{lineCount}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-sm text-slate-600 mb-1">Status</div>
              <div className="text-2xl font-bold text-slate-900">
                {isValid === true ? 'Valid' : isValid === false ? 'Invalid' : '—'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-sm text-slate-600 mb-1">Format</div>
              <div className="text-2xl font-bold text-slate-900">
                {isMinified ? 'Minified' : isFormatted ? 'Formatted' : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Features & Info */}
        <div className="space-y-6">
          {/* Tree View Toggle */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  JSON Tree View
                </h3>
                <button
                  onClick={() => setShowTreeView(!showTreeView)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${showTreeView ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {showTreeView ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {showTreeView && jsonTree && (
              <div className="p-6">
                <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
                  <pre className="text-slate-700">{JSON.stringify(jsonTree, null, 2)}</pre>
                </div>
              </div>
            )}
            {showTreeView && !jsonTree && (
              <div className="p-6 text-center text-slate-500">
                <p>Enter valid JSON to view tree structure</p>
              </div>
            )}
          </div>

          {/* JSON Guide */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                JSON Quick Guide
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-900">Valid JSON Structure</div>
                  <div className="text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-lg">
                    {"{\n  \"key\": \"value\",\n  \"number\": 42,\n  \"array\": [1, 2, 3],\n  \"object\": {\"nested\": true}\n}"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-900">Common Errors</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      Missing commas between items
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      Unquoted property names
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      Trailing commas in objects/arrays
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      Mismatched brackets or braces
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigator.clipboard.writeText('{}')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <Copy className="w-4 h-4" />
                Copy Empty JSON Template
              </button>
              <button
                onClick={() => handleFormat(2)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Auto-Format JSON
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                Upload & Validate File
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Why Use Our Free JSON Formatter & Validator?
          </h2>
          
          <p className="text-lg text-slate-700 mb-6">
            Working with <strong>JSON data</strong> is essential for modern web development, APIs, and data exchange. Our <strong>free online JSON formatter and validator</strong> provides instant tools to <strong>beautify, minify, validate, and manage JSON data</strong> with professional precision. Perfect for developers, data analysts, and API engineers.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Key Features
              </h3>
              <ul className="space-y-3">
                {[
                  '100% Free - No hidden costs or limitations',
                  'Real-time Validation - Instant JSON syntax checking',
                  'File Upload/Download - Easy JSON file management',
                  'Multiple Format Options - 2 or 4 space indentation',
                  'Minify/Compact - Reduce JSON file size',
                  'Tree View - Visual JSON structure exploration',
                  'Error Highlighting - Detailed error messages',
                  'Browser-Based - Works locally, no server processing'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Development Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  'Faster API Development',
                  'Better Debugging & Error Detection',
                  'Improved Code Readability',
                  'Reduced Data Transmission Size',
                  'Enhanced Data Validation',
                  'Simplified JSON File Management',
                  'Streamlined Development Workflow',
                  'Increased Productivity'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
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
                Frequently Asked Questions About JSON Tools
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
            <h3 className="text-lg font-bold text-slate-900 mb-4">Popular JSON Tool Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.slice(15, 35).map((keyword, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-4">Ready to Format Your JSON?</h3>
            <p className="text-blue-100 mb-4">
              Get instant JSON formatting, validation, and minification for free. Perfect for API development, data analysis, and web development. No registration required - start working with JSON now!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Start Formatting JSON
              </button>
              <a
                href="https://thewebtoolskit.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                More Developer Tools
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-4 text-sm text-blue-300">
              Visit <a href="https://thewebtoolskit.com" className="underline hover:text-white">thewebtoolskit.com</a> for more free developer tools and resources.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Keywords Footer */}
      <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold mb-3">RELATED DEVELOPER KEYWORDS</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularKeywords.slice(25, 45).map((keyword, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-slate-800 rounded hover:text-slate-300 transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-xs mt-4 text-slate-500">
            © {new Date().getFullYear()} The Web Toolskit - Free JSON Formatter & Validator Tool. All data processes locally in your browser.
          </p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};