import React, { useState, useRef, useEffect } from 'react';
declare function gtag(
  command: string,
  targetId: string | Date,
  params?: Record<string, any>
): void;

declare global {
  interface Window {
    pdfjsLib: any;
    PDFLib: any;
  }
}
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Edit, 
  Shield, 
  Smartphone, 
  Zap, 
  Clock,
  FileEdit,
  Eye,
  Copy,
  Search,
  RotateCcw,
  Bold,
  Italic,
  Underline,
  Type,
  Palette,
  ChevronRight,
  Star,
  Users,
  Globe,
  Menu,
  X
} from 'lucide-react';

const PDFEditor = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fontSize, setFontSize] = useState(14);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  // Calculate word count
  useEffect(() => {
    const words = editedText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [editedText]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const lines = editedText.split('\n');
    const results = lines
      .map((line, index) => ({
        line: index + 1,
        text: line,
        matches: line.toLowerCase().includes(searchTerm.toLowerCase())
      }))
      .filter(item => item.matches);
    
    setSearchResults(results);
  }, [searchTerm, editedText]);

  const loadPDFJS = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;
    
    // Load from CDN with fallback
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    return new Promise((resolve, reject) => {
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js'));
    });
  };

  const loadPDFLib = async () => {
    if (window.PDFLib) return window.PDFLib;
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    return new Promise((resolve, reject) => {
      script.onload = () => resolve(window.PDFLib);
      script.onerror = () => reject(new Error('Failed to load PDF-Lib'));
    });
  };

  const extractTextFromPDF = async (file) => {
    try {
      const pdfjsLib = await loadPDFJS();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      let pageCount = pdf.numPages;
      
      // Show progress for multi-page PDFs
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `Page ${i}:\n${pageText}\n\n`;
      }
      
      return { text: fullText.trim(), pageCount };
    } catch (err) {
      console.error('PDF extraction error:', err);
      throw new Error('Failed to extract text. The file may be corrupted, password-protected, or contain only images.');
    }
  };

  const handleFileSelect = async (selectedFile) => {
    setError('');
    setSuccess('');
    setSearchTerm('');
    setSearchResults([]);
    
    if (!selectedFile) return;
    
    // Validate file
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF file (.pdf extension required)');
      return;
    }
    
    if (selectedFile.size > 25 * 1024 * 1024) { // Increased to 25MB
      setError('File size must be less than 25MB for optimal performance');
      return;
    }
    
    if (selectedFile.size === 0) {
      setError('File is empty');
      return;
    }
    
    setFile(selectedFile);
    setLoading(true);
    
    try {
      const { text, pageCount } = await extractTextFromPDF(selectedFile);
      if (!text || text.trim().length === 0) {
        throw new Error('No readable text found. This may be a scanned/image-based PDF. Try using OCR software first.');
      }
      setExtractedText(text);
      setEditedText(text);
      setSuccess(`✓ PDF loaded successfully! ${pageCount} page${pageCount > 1 ? 's' : ''} processed. You can now edit the text below.`);
      
      // Auto-scroll to editor
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setFile(null);
      setExtractedText('');
      setEditedText('');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatText = (command) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editedText.substring(start, end);
    
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
      default:
        return;
    }
    
    const newText = editedText.substring(0, start) + formattedText + editedText.substring(end);
    setEditedText(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const handleDownload = async () => {
    if (!editedText || editedText.trim().length === 0) {
      setError('Please add some text before downloading');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const PDFLib = await loadPDFLib();
      const { PDFDocument, rgb, StandardFonts } = PDFLib;
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const fontSizeValue = 11;
      const margin = 72;
      const lineHeight = fontSizeValue * 1.5;
      
      let page = pdfDoc.addPage([612, 792]); // Letter size
      let { width, height } = page.getSize();
      let yPosition = height - margin;
      
      // Parse markdown-like formatting
      const lines = editedText.split('\n');
      const maxWidth = width - (margin * 2);
      
      let currentFont = font;
      
      for (const line of lines) {
        // Check if we need a new page
        if (yPosition < margin + lineHeight) {
          page = pdfDoc.addPage([612, 792]);
          yPosition = height - margin;
        }
        
        // Simple markdown parsing for bold
        if (line.includes('**')) {
          const parts = line.split('**');
          let xPosition = margin;
          
          for (let i = 0; i < parts.length; i++) {
            const text = parts[i];
            if (text) {
              currentFont = i % 2 === 1 ? boldFont : font;
              const textWidth = currentFont.widthOfTextAtSize(text, fontSizeValue);
              
              // Handle text wrapping for formatted text
              if (xPosition + textWidth > width - margin) {
                yPosition -= lineHeight;
                xPosition = margin;
                
                if (yPosition < margin + lineHeight) {
                  page = pdfDoc.addPage([612, 792]);
                  yPosition = height - margin;
                }
              }
              
              page.drawText(text, {
                x: xPosition,
                y: yPosition,
                size: fontSizeValue,
                font: currentFont,
                color: rgb(0, 0, 0),
              });
              
              xPosition += textWidth;
            }
          }
        } else {
          // Regular text with wrapping
          const words = line.split(' ');
          let currentLine = '';
          let lineX = margin;
          
          for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const textWidth = font.widthOfTextAtSize(testLine, fontSizeValue);
            
            if (textWidth > maxWidth && currentLine) {
              page.drawText(currentLine, {
                x: lineX,
                y: yPosition,
                size: fontSizeValue,
                font: font,
                color: rgb(0, 0, 0),
              });
              
              yPosition -= lineHeight;
              currentLine = word;
              
              if (yPosition < margin + lineHeight) {
                page = pdfDoc.addPage([612, 792]);
                yPosition = height - margin;
              }
            } else {
              currentLine = testLine;
            }
          }
          
          if (currentLine) {
            page.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: fontSizeValue,
              font: font,
              color: rgb(0, 0, 0),
            });
          }
        }
        
        yPosition -= lineHeight * 1.2;
      }
      
      // Add metadata
      pdfDoc.setTitle(file?.name.replace('.pdf', '') || 'Edited Document');
      pdfDoc.setAuthor('Online PDF Editor');
      pdfDoc.setSubject('Edited PDF Document');
      pdfDoc.setKeywords(['pdf', 'edit', 'online', 'free']);
      pdfDoc.setCreationDate(new Date());
      pdfDoc.setModificationDate(new Date());
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${file?.name.replace('.pdf', '') || 'document'}_edited.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      setSuccess('✅ PDF downloaded successfully! Your file is ready.');
      
      // Analytics event (non-personal)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pdf_download', {
          'event_category': 'engagement',
          'event_label': 'PDF Download'
        });
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try with less text or check browser compatibility.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear everything? This cannot be undone.')) {
      setFile(null);
      setExtractedText('');
      setEditedText('');
      setError('');
      setSuccess('');
      setSearchTerm('');
      setSearchResults([]);
      setWordCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editedText)
      .then(() => {
        setSuccess('Text copied to clipboard!');
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(() => setError('Failed to copy text'));
  };

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: '100% Secure & Private', desc: 'All processing happens in your browser. No server uploads.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Instant Processing', desc: 'No waiting time. Edit and download in seconds.' },
    { icon: <Smartphone className="w-6 h-6" />, title: 'Mobile-Friendly', desc: 'Works perfectly on all devices and browsers.' },
    { icon: <Globe className="w-6 h-6" />, title: 'No Registration', desc: 'Start editing immediately. No sign-up required.' },
    { icon: <FileEdit className="w-6 h-6" />, title: 'Rich Text Editing', desc: 'Basic formatting options available.' },
    { icon: <Clock className="w-6 h-6" />, title: '24/7 Availability', desc: 'Access our tool anytime, anywhere.' },
  ];

  const faqs = [
    {
      q: 'How do I edit a PDF online for free?',
      a: 'Simply upload your PDF file, edit the text in our online editor, and download the modified PDF - completely free!'
    },
    {
      q: 'Will the formatting of my PDF be preserved?',
      a: 'While we preserve text content and basic structure, complex formatting like images and tables may be simplified in the output.'
    },
    {
      q: 'Is my PDF file secure?',
      a: 'Absolutely! Your PDF never leaves your browser. All processing happens locally on your device for maximum security.'
    },
    {
      q: 'Can I edit PDFs on my phone or tablet?',
      a: 'Yes! Our PDF editor is fully responsive and works on all mobile devices, tablets, and desktop computers.'
    },
    {
      q: 'Do I need to install software or create an account?',
      a: 'No installation or registration required. Just visit our site and start editing PDFs immediately.'
    },
    {
      q: 'What are the file size limits?',
      a: 'You can upload PDF files up to 25MB. For larger files, consider compressing them first.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Free PDF Editor Online</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Edit PDF files instantly in your browser</p>
              </div>
            </div>
            
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium">How It Works</a>
              <a href="#faq" className="text-gray-700 hover:text-indigo-600 font-medium">FAQ</a>
              <a 
                href="https://thewebtoolskit.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                More Tools
              </a>
            </nav>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block py-2 text-gray-700 hover:text-indigo-600">Features</a>
              <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-indigo-600">How It Works</a>
              <a href="#faq" className="block py-2 text-gray-700 hover:text-indigo-600">FAQ</a>
              <a 
                href="https://thewebtoolskit.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-center"
              >
                More Tools
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Edit PDF Online <span className="text-indigo-600">Free</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Upload, edit, and download PDF files instantly. No registration, no watermarks, 
            100% free PDF editor that works in your browser.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span>No Installation</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Friendly</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span>Fast Processing</span>
            </div>
          </div>
        </div>

        {/* Main Editor Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-12">
          {/* Upload/Editor Section */}
          <div className="p-8">
            {!file ? (
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
                    <Upload className="w-12 h-12 text-indigo-600" />
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
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      <Upload className="w-5 h-5" />
                      Choose PDF File
                    </label>
                    
                    <p className="text-sm text-gray-500">
                      Supports PDF files up to 25MB • No file storage • 100% secure
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div ref={editorRef}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <FileText className="w-8 h-8 text-indigo-600" />
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
                      onClick={handleClear}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={loading}
                      className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Edited PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Editor Toolbar */}
                <div className="border border-gray-200 rounded-t-xl bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => formatText('bold')}
                        className={`p-2 rounded ${isBold ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => formatText('italic')}
                        className={`p-2 rounded ${isItalic ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => formatText('underline')}
                        className={`p-2 rounded ${isUnderline ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                        title="Underline"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="relative max-w-xs">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                        <Copy className="w-4 h-4" />
                        Copy Text
                      </button>
                      <div className="text-sm text-gray-600">
                        {wordCount} words • {editedText.length} chars
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
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-[500px] p-6 border border-gray-300 border-t-0 rounded-b-xl focus:ring-3 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-base leading-relaxed bg-white"
                  placeholder="Your PDF text will appear here. You can edit it freely..."
                  style={{ fontSize: `${fontSize}px` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {(error || success || loading) && (
          <div className="mb-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 animate-slide-in">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start gap-3 animate-slide-in">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Success</p>
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            )}
            
            {loading && !file && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <div>
                  <p className="font-medium text-blue-800">Processing PDF...</p>
                  <p className="text-blue-700">Extracting text from your document</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our PDF Editor?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Edit PDF in 3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center relative">
                <div className="bg-white text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Upload PDF</h3>
                <p className="text-indigo-100">Select your PDF file or drag & drop it</p>
                <div className="absolute top-8 right-0 hidden md:block">
                  <ChevronRight className="w-8 h-8 text-white opacity-50" />
                </div>
              </div>
              
              <div className="text-center relative">
                <div className="bg-white text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Edit Text</h3>
                <p className="text-indigo-100">Modify text directly in the editor</p>
                <div className="absolute top-8 right-0 hidden md:block">
                  <ChevronRight className="w-8 h-8 text-white opacity-50" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Download</h3>
                <p className="text-indigo-100">Save your edited PDF instantly</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-3">
                    <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </div>
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 pl-11">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Edit Your PDF?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who edit their PDFs with our free online tool every day.
            </p>
            {!file ? (
              <label
                htmlFor="pdf-upload"
                className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all cursor-pointer shadow-2xl hover:shadow-3xl"
              >
                <Edit className="w-5 h-5" />
                Start Editing PDF Now
              </label>
            ) : (
              <button
                onClick={handleDownload}
                disabled={loading}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-2xl hover:shadow-3xl disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                Download Your Edited PDF
              </button>
            )}
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <p className="text-center text-gray-700 text-sm">
            Popular searches: <span className="font-medium">edit PDF online free</span> • 
            <span className="font-medium"> PDF editor no watermark</span> • 
            <span className="font-medium"> online PDF text editor</span> • 
            <span className="font-medium"> modify PDF free</span> • 
            <span className="font-medium"> PDF editing tool</span> • 
            <span className="font-medium"> edit PDF text online</span> • 
            <span className="font-medium"> PDF file editor</span> • 
            <span className="font-medium"> change text in PDF</span> • 
            <span className="font-medium"> browser PDF editor</span> • 
            <span className="font-medium"> secure PDF editing</span>
          </p>
        </div>

        {/* Privacy Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Your Privacy is Protected</h3>
                <p className="text-gray-700">
                  All processing happens in your browser. No files are uploaded to any server.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Trusted by 10,000+ users</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Free PDF Editor</h3>
              </div>
              <p className="text-gray-400">
                Edit PDF files online for free. No installation, no registration, 100% secure.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Tools</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">PDF Compressor</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">PDF Merger</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">PDF to Word</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Word to PDF</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">More Tools</h4>
              <a 
                href="https://thewebtoolskit.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                <Globe className="w-4 h-4" />
                Visit TheWebToolkit.com
              </a>
              <p className="text-gray-400 text-sm mt-3">
                Discover more free web tools for your daily needs.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Free Online PDF Editor. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-gray-400">Popular: </span>
                <span className="text-sm text-gray-300">Edit PDF</span>
                <span className="text-sm text-gray-300">PDF Editor Online</span>
                <span className="text-sm text-gray-300">Free PDF Tools</span>
                <span className="text-sm text-gray-300">Modify PDF</span>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                This tool processes files entirely in your browser. No data is sent to any server.
                Works on Chrome, Firefox, Safari, Edge, and mobile browsers.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PDFEditor;