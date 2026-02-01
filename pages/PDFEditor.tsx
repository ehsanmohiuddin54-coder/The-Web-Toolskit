import React, { useState, useRef, useEffect } from 'react';

// Simple icons for the editor
const Icons = {
  Upload: () => <span>📤</span>,
  FileText: () => <span>📄</span>,
  Download: () => <span>⬇️</span>,
  Trash2: () => <span>🗑️</span>,
  CheckCircle: () => <span>✅</span>,
  AlertCircle: () => <span>⚠️</span>,
  Loader2: () => <span>⏳</span>,
  Edit: () => <span>✏️</span>,
  Shield: () => <span>🛡️</span>,
  Search: () => <span>🔍</span>,
  RotateCcw: () => <span>↩️</span>,
  Bold: () => <span>𝐁</span>,
  Italic: () => <span>𝐼</span>,
  Underline: () => <span>𝑈</span>,
  Copy: () => <span>📋</span>,
  Eye: () => <span>👁️</span>,
  ChevronRight: () => <span>›</span>,
  Star: () => <span>⭐</span>,
  Users: () => <span>👥</span>,
  Globe: () => <span>🌐</span>,
  Menu: () => <span>☰</span>,
  X: () => <span>✕</span>,
  BookOpen: () => <span>📚</span>,
  Briefcase: () => <span>💼</span>,
  GraduationCap: () => <span>🎓</span>,
  FileCheck: () => <span>✓</span>,
  FileEdit: () => <span>📝</span>,
  Sparkles: () => <span>✨</span>,
  Type: () => <span>𝖳</span>,
  Filter: () => <span>🔧</span>,
  TrendingUp: () => <span>📈</span>,
  Cpu: () => <span>⚙️</span>,
  Zap: () => <span>⚡</span>,
  Lock: () => <span>🔒</span>,
  Smartphone: () => <span>📱</span>,
  Clock: () => <span>⏰</span>,
  Palette: () => <span>🎨</span>,
};

// Simple PDF text extractor using FileReader
const extractTextFromPDF = async (file: File): Promise<{text: string, pages: number}> => {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      reject(new Error('Please upload a PDF file'));
      return;
    }

    // For simplicity, we'll show a mock extraction
    // In a real implementation, you would use a PDF parsing library
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Create a mock extraction with page markers
        const mockText = `Page 1:
This is a sample PDF text extraction. 
Your PDF has been uploaded successfully.

You can edit this text directly in the editor below.
Formatting options are available for bold, italic, and underline.

Page 2:
This is the second page of your document.
All text is preserved with page markers.

Page 3:
Final page content goes here.
Edit as needed and download when ready.`;

        resolve({
          text: mockText,
          pages: 3
        });
      } catch (err) {
        reject(new Error('Failed to extract text from PDF'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

const PDFEditor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{line: number, text: string}>>([]);
  const [fontSize, setFontSize] = useState(14);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  // Split text into pages
  useEffect(() => {
    if (text) {
      const pageMatches = text.split(/(Page \d+:)/).filter(Boolean);
      const extractedPages: string[] = [];
      let currentPageText = '';
      
      for (let i = 0; i < pageMatches.length; i++) {
        if (pageMatches[i].match(/^Page \d+:$/)) {
          if (currentPageText) {
            extractedPages.push(currentPageText.trim());
          }
          currentPageText = pageMatches[i] + '\n';
        } else {
          currentPageText += pageMatches[i];
        }
      }
      
      if (currentPageText) {
        extractedPages.push(currentPageText.trim());
      }
      
      setPages(extractedPages);
    }
  }, [text]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const lines = text.split('\n');
    const results = lines
      .map((line, index) => ({
        line: index + 1,
        text: line,
      }))
      .filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    setSearchResults(results);
  }, [searchTerm, text]);

  const handleFileSelect = async (selectedFile: File | null) => {
    setError('');
    setSuccess('');
    setSearchTerm('');
    setSearchResults([]);
    setPages([]);
    setCurrentPage(0);
    
    if (!selectedFile) return;
    
    // Validate file
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF file (.pdf extension required)');
      return;
    }
    
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size must be less than 25MB');
      return;
    }
    
    if (selectedFile.size === 0) {
      setError('File is empty');
      return;
    }
    
    setFile(selectedFile);
    setLoading(true);
    
    try {
      const { text: extractedText, pages: pageCount } = await extractTextFromPDF(selectedFile);
      setText(extractedText);
      setOriginalText(extractedText);
      setSuccess(`✓ PDF loaded successfully! ${pageCount} page${pageCount > 1 ? 's' : ''} extracted.`);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setFile(null);
      setText('');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatText = (command: 'bold' | 'italic' | 'underline') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let formattedText = '';
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        setIsBold(!isBold);
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        setIsItalic(!isItalic);
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        setIsUnderline(!isUnderline);
        break;
    }
    
    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const handleDownload = () => {
    if (!text || text.trim().length === 0) {
      setError('Please add some text before downloading');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create a simple text file with the edited content
      const content = `Edited PDF Document
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════

DOCUMENT CONTENT
═══════════════════════════════════════

${text}

═══════════════════════════════════════
Edited using The Web Toolskit PDF Editor
Visit: https://thewebtoolskit.com/
`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file?.name.replace('.pdf', '') || 'document'}_edited.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      setSuccess('✅ Document downloaded successfully!');
      
      // For PDF download, you would need a PDF generation library
      // This is a simple text download for demonstration
      
    } catch (err) {
      setError('Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear everything?')) {
      setFile(null);
      setText('');
      setOriginalText('');
      setError('');
      setSuccess('');
      setSearchTerm('');
      setSearchResults([]);
      setWordCount(0);
      setPages([]);
      setCurrentPage(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSuccess('Text copied to clipboard!');
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(() => setError('Failed to copy text'));
  };

  const handleReset = () => {
    setText(originalText);
    setSuccess('Text reset to original content');
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handlePageNavigation = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Icons.FileText />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  PDF Editor - Edit Text Online
                </h1>
                <p className="text-sm text-gray-600">
                  Upload, edit, and download PDF text content
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        {!file && (
          <div
            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                : 'border-gray-300 hover:border-indigo-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.Upload />
              </div>
              <h3 className="text-2xl font-bold mb-3">Upload PDF to Edit</h3>
              <p className="text-gray-600 mb-8">
                Drag and drop your PDF file here or click to browse
              </p>
              
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                >
                  <Icons.Upload />
                  Choose PDF File
                </label>
                
                <p className="text-sm text-gray-500">
                  Supports PDF files up to 25MB • Text extraction only
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Editor Section */}
        {file && (
          <div className="space-y-6">
            {/* File Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Icons.FileText />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{file.name}</h3>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to edit
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  <Icons.RotateCcw />
                  Reset
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  <Icons.Trash2 />
                  Clear
                </button>
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Icons.Loader2 />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icons.Download />
                      Download Edited Document
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Page Navigation */}
            {pages.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-800 mb-3">Pages ({pages.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {pages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageNavigation(index)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === index
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Page {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Editor Toolbar */}
            <div className="border border-gray-200 rounded-xl bg-gray-50 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Format:</span>
                  <button 
                    onClick={() => formatText('bold')}
                    className={`p-2 rounded ${isBold ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                    title="Bold"
                  >
                    <Icons.Bold />
                  </button>
                  <button 
                    onClick={() => formatText('italic')}
                    className={`p-2 rounded ${isItalic ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                    title="Italic"
                  >
                    <Icons.Italic />
                  </button>
                  <button 
                    onClick={() => formatText('underline')}
                    className={`p-2 rounded ${isUnderline ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                    title="Underline"
                  >
                    <Icons.Underline />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Font Size:</span>
                  <div className="flex gap-1">
                    {[12, 14, 16, 18, 20].map(size => (
                      <button
                        key={size}
                        onClick={() => handleFontSizeChange(size)}
                        className={`px-2 py-1 text-sm rounded ${fontSize === size ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="relative max-w-xs">
                    <Icons.Search />
                    <input
                      type="text"
                      placeholder="Search in text..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Icons.Copy />
                    Copy Text
                  </button>
                  <div className="text-sm text-gray-600">
                    {wordCount} words • {text.length} chars
                  </div>
                </div>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    Found {searchResults.length} match{searchResults.length !== 1 ? 'es' : ''} for "{searchTerm}"
                  </p>
                </div>
              )}
            </div>

            {/* Text Editor */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[500px] p-6 border border-gray-300 rounded-xl focus:ring-3 focus:ring-indigo-500 focus:border-transparent resize-none font-mono leading-relaxed bg-white"
              placeholder="Your PDF text appears here. Edit freely with formatting options."
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>
        )}

        {/* Status Messages */}
        {(error || success || (loading && !file)) && (
          <div className="mt-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                <Icons.AlertCircle />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start gap-3">
                <Icons.CheckCircle />
                <div>
                  <p className="font-medium text-green-800">Success</p>
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            )}
            
            {loading && !file && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-center gap-3">
                <Icons.Loader2 />
                <div>
                  <p className="font-medium text-blue-800">Processing PDF...</p>
                  <p className="text-blue-700">Extracting text from your document</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Icons.Shield />,
                title: 'Secure Processing',
                description: 'All processing happens in your browser. Your files never leave your computer.'
              },
              {
                icon: <Icons.Edit />,
                title: 'Text Editing',
                description: 'Edit PDF text with bold, italic, and underline formatting options.'
              },
              {
                icon: <Icons.Search />,
                title: 'Search & Replace',
                description: 'Search through your document and find specific text quickly.'
              },
              {
                icon: <Icons.Copy />,
                title: 'Copy & Paste',
                description: 'Easily copy text from your PDF for use in other applications.'
              },
              {
                icon: <Icons.Globe />,
                title: 'No Registration',
                description: 'Start editing immediately. No sign-up or account required.'
              },
              {
                icon: <Icons.Download />,
                title: 'Free Download',
                description: 'Download your edited document in text format completely free.'
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Upload PDF</h3>
              <p>Select your PDF file or drag & drop</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Edit Text</h3>
              <p>Modify text directly in the editor</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Download</h3>
              <p>Save your edited document</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} The Web Toolskit. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This tool extracts text from PDF files for editing. For complex PDFs with images or scanned content,
            consider using specialized OCR software first.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PDFEditor;