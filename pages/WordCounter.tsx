import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Copy, Trash2, Upload, Moon, Sun, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    pdfjsLib: any;
    mammoth: any;
  }
}

// Utility Functions
const countWords = (text) => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const countCharacters = (text) => text.length;

const countCharactersNoSpaces = (text) => text.replace(/\s/g, '').length;

const countSentences = (text) => {
  if (!text.trim()) return 0;
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
};

const countParagraphs = (text) => {
  if (!text.trim()) return 0;
  return text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
};

const calculateReadingTime = (wordCount) => {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

const getKeywordDensity = (text) => {
  if (!text.trim()) return [];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  const sorted = Object.entries(frequency)
    .sort(([, a], [, b]) => Number(b) - Number(a))
    .slice(0, 5)
    .map(([word, count]) => ({
      word,
      count: Number(count),
      density: ((Number(count) / words.length) * 100).toFixed(2),
    }));

  return sorted;
};

const extractTextFromFile = async (file) => {
  const fileType = file.name.split('.').pop().toLowerCase();
  
  if (fileType === 'txt') {
    return await file.text();
  } else if (fileType === 'pdf') {
    return await extractPDFText(file);
  } else if (fileType === 'docx') {
    return await extractDOCXText(file);
  }
  
  return '';
};

const extractPDFText = async (file) => {
  try {
    // Dynamically load PDF.js if not already loaded
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Load worker script
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) {
      throw new Error('No readable text found in PDF');
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please try a text file or copy-paste the content.');
  }
};

const extractDOCXText = async (file) => {
  try {
    // Dynamically load mammoth if not already loaded
    if (!window.mammoth) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value || result.value.trim().length < 10) {
      throw new Error('No readable text found in DOCX');
    }
    
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX. Please try a text file or copy-paste the content.');
  }
};

const generatePDF = (stats, text, keywords) => {
  const content = `
WORD COUNTER ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════

TEXT STATISTICS
───────────────────────────────────────
Words: ${stats.words}
Characters (with spaces): ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ${stats.readingTime} ${stats.readingTime === 1 ? 'minute' : 'minutes'}

═══════════════════════════════════════

TOP KEYWORDS
───────────────────────────────────────
${keywords.length > 0 ? keywords.map((k, i) => `${i + 1}. ${k.word} - ${k.count} occurrences (${k.density}%)`).join('\n') : 'No keywords found'}

═══════════════════════════════════════

ORIGINAL TEXT
───────────────────────────────────────
${text || '(No text provided)'}

═══════════════════════════════════════
Report generated by Word Counter Tool
Visit: https://thewebtoolskit.com/
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `word-count-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Main Component
export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });
  const [keywords, setKeywords] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const newStats = {
      words: countWords(text),
      characters: countCharacters(text),
      charactersNoSpaces: countCharactersNoSpaces(text),
      sentences: countSentences(text),
      paragraphs: countParagraphs(text),
      readingTime: calculateReadingTime(countWords(text))
    };
    setStats(newStats);
    setKeywords(getKeywordDensity(text));
  }, [text]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['txt', 'pdf', 'docx'];
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileType)) {
      alert('Please upload a .txt, .pdf, or .docx file');
      return;
    }
    
    // Reset file input
    e.target.value = '';
    
    try {
      setUploading(true);
      setUploadError('');
      const extractedText = await extractTextFromFile(file);
      setText(extractedText);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleClear = () => {
    setText('');
    setUploadError('');
  };

  const handleDownloadPDF = () => {
    generatePDF(stats, text, keywords);
  };

  // SEO Keywords List (including all provided keywords)
  const seoKeywords = [
    "word counter",
    "free word counter",
    "online word counter",
    "character counter",
    "sentence counter",
    "paragraph counter",
    "word count tool",
    "text analysis",
    "keyword density",
    "reading time calculator",
    "document word counter",
    "SEO word counter",
    "article word counter tool",
    "blog word count checker",
    "free online word counter",
    "word counter for essays",
    "PDF word counter online free",
    "online essay word count tool",
    "upload file word counter",
    "free word counter for assignments",
    "easy word counter tool",
    "word counter for PDF files",
    "free document word counter",
    "online word counter for students",
    "count words in PDF online free",
    "fast word counter tool",
    "academic essay word counter",
    "word counter tool with file upload",
    "free writing word counter",
    "essay word counter online free",
    "simple word counter online",
    "instant word count checker",
    "word count tool for students"
  ];

  // Popular keywords for display (shorter list)
  const popularKeywords = [
    "free online word counter",
    "word counter for essays",
    "PDF word counter online free",
    "upload file word counter",
    "word counter for PDF files",
    "free document word counter",
    "online word counter for students",
    "academic essay word counter",
    "word counter tool with file upload",
    "essay word counter online free",
    "instant word count checker",
    "article word counter tool"
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* SEO Header with updated content */}
      <header className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Free Online Words Counter Tool - Count Words Instantly
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Advanced word counter tool for essays, articles, blogs & documents. Upload PDF, DOCX files for instant word count. Free online word counter for students & writers.
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Words', value: stats.words, icon: '📝', color: 'blue' },
            { label: 'Characters', value: stats.characters, icon: '🔤', color: 'purple' },
            { label: 'No Spaces', value: stats.charactersNoSpaces, icon: '✂️', color: 'green' },
            { label: 'Sentences', value: stats.sentences, icon: '💬', color: 'orange' },
            { label: 'Paragraphs', value: stats.paragraphs, icon: '📄', color: 'pink' },
            { label: 'Read Time', value: `${stats.readingTime}m`, icon: '⏱️', color: 'indigo' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-5 rounded-xl border shadow-sm text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} transition-all`}>
                {stat.value}
              </div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase font-semibold tracking-wider mt-1`}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Action Buttons */}
        <section className="flex flex-wrap gap-3 mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.pdf,.docx"
            className="hidden"
            disabled={uploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Processing...' : 'Upload Word/PDF File'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!text}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${darkMode ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800' : 'bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50'} ${darkMode ? 'text-white' : 'text-slate-700'} disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
          >
            {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copySuccess ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={!text}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${darkMode ? 'bg-green-600 hover:bg-green-700 disabled:bg-slate-800' : 'bg-green-500 hover:bg-green-600 disabled:bg-slate-50'} text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button
            onClick={handleClear}
            disabled={!text}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${darkMode ? 'bg-red-600 hover:bg-red-700 disabled:bg-slate-800' : 'bg-red-500 hover:bg-red-600 disabled:bg-slate-50'} text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </section>

        {/* Upload Status Messages */}
        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Document uploaded successfully! Word count analysis complete.
          </div>
        )}

        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            {uploadError}
          </div>
        )}

        {/* Editor */}
        <section className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-xl border shadow-sm overflow-hidden mb-8`}>
          <div className={`p-4 border-b ${darkMode ? 'border-slate-700 bg-slate-750' : 'border-slate-100 bg-slate-50'} flex justify-between items-center`}>
            <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'} flex items-center gap-2`}>
              <FileText className="w-4 h-4" />
              Text Editor - Word Counter for Essays & Documents
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Live word counting enabled | Upload PDF, DOCX, TXT files
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here to count words instantly... Or use our free online word counter tool with file upload support for essays, blogs, articles, and documents."
            className={`w-full h-96 p-6 focus:outline-none resize-none text-lg transition-colors ${darkMode ? 'bg-slate-800 text-slate-200 placeholder:text-slate-600' : 'bg-white text-slate-700 placeholder:text-slate-300'}`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          ></textarea>
        </section>

        {/* Keyword Density */}
        {keywords.length > 0 && (
          <section className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-xl border shadow-sm mb-8`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Top Keywords (Density Analysis)
            </h2>
            <div className="space-y-3">
              {keywords.map((kw, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`text-sm font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      #{idx + 1}
                    </span>
                    <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      {kw.word}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {kw.count} times
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
                      {kw.density}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Updated SEO Information Section with keywords */}
        <article className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-800' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'} p-6 rounded-xl border mb-8`}>
          <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Free Online Word Counter Tool for Students, Writers & SEO
          </h2>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>
            Our <strong>free online word counter</strong> is an advanced tool that accurately counts words, characters, sentences, and paragraphs in your text. Perfect for students checking <strong>essay word count</strong>, bloggers analyzing <strong>article word count</strong>, and professionals working with documents. Upload PDF files, DOCX documents, or text files directly - our <strong>PDF word counter online free</strong> tool extracts text instantly. This <strong>fast word counter tool</strong> is essential for meeting assignment requirements, optimizing SEO content, and improving writing efficiency.
          </p>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Features of Our Word Counter Tool with File Upload
          </h3>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'} ml-5 list-disc`}>
            <li><strong>Real-time word counting</strong> for essays, blogs, and articles</li>
            <li><strong>Upload and analyze PDF files</strong> with our PDF word counter online free</li>
            <li><strong>Word counter for DOCX documents</strong> and text files</li>
            <li><strong>Academic essay word counter</strong> with reading time estimation</li>
            <li><strong>Keyword density analysis</strong> for SEO optimization</li>
            <li><strong>Instant word count checker</strong> with live updates</li>
            <li><strong>Free writing word counter</strong> for assignments and documents</li>
            <li><strong>Simple word counter online</strong> interface with dark mode</li>
            <li><strong>Count words in PDF online free</strong> without registration</li>
            <li><strong>Blog word count checker</strong> for content creators</li>
          </ul>
        </article>

        {/* Updated FAQ Section with keywords */}
        <section className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-xl border shadow-sm mb-8`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Frequently Asked Questions - Word Counter Tool
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                How accurate is this free online word counter?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Our <strong>word counter tool</strong> uses advanced algorithms to accurately count words by splitting text on whitespace and filtering empty strings, ensuring precise results for all types of content including articles, essays, and blog posts. It's the perfect <strong>academic essay word counter</strong> for students.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Can I upload PDF documents to count words?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Yes! Our <strong>word counter for PDF files</strong> supports TXT, PDF, and DOCX files. The tool extracts text and provides instant word count analysis. For best results with PDF and DOCX files, you may want to copy and paste the text directly into our <strong>free document word counter</strong>.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Is this word counter free for academic use?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Absolutely! Our <strong>online word counter for students</strong> is completely free with no registration required. You can count words unlimited times for essays, assignments, and research papers. It's the perfect <strong>free word counter for assignments</strong>.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                How do I use the word counter tool with file upload?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Simply click "Upload Word/PDF File" and select your document. Our <strong>word counter tool with file upload</strong> supports PDF, DOCX, and TXT formats. For large documents, you can also paste text directly into the editor of our <strong>simple word counter online</strong>.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Can I count words in PDF online for free?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Yes! Our <strong>PDF word counter online free</strong> tool extracts text from PDF files and provides detailed word count statistics. It's perfect for students, writers, and professionals who need to <strong>count words in PDF online free</strong>.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Is there an essay word counter online free?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Yes! Our <strong>essay word counter online free</strong> tool is specifically designed for academic writing. It helps students meet word count requirements and provides reading time estimates. Try our <strong>free writing word counter</strong> for all your academic needs.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Tip */}
        <div className={`${darkMode ? 'bg-blue-900 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-800'} p-4 rounded-xl border text-sm flex items-start gap-3 mb-8`}>
          <span className="text-lg">💡</span>
          <p>
            <strong>SEO Pro Tip:</strong> Use our <strong>article word counter tool</strong> for SEO optimization. Aim for blog posts over 1,000 words, maintain keyword density between 1-2%, and use our <strong>blog word count checker</strong> to ensure content length meets SEO best practices.
          </p>
        </div>

        {/* Updated Keywords Section with all provided keywords */}
        <section className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-xl border shadow-sm mb-8`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Popular Keywords - Word Counter Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((keyword, index) => (
              <span
                key={index}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'} transition-colors cursor-default border ${darkMode ? 'border-slate-600' : 'border-blue-200'}`}
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className={`text-sm mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {seoKeywords.join(', ')}
          </p>
        </section>
      </main>

      {/* Updated Footer with keywords */}
      <footer className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t mt-12 transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Word Counter Tool</h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Free online word counter tool for essays, articles, blogs & documents. Upload PDF, DOCX files. <strong>Fast word counter tool</strong> for students & writers.
              </p>
            </div>
            <div>
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Quick Links</h3>
              <ul className={`text-sm space-y-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><a href="https://thewebtoolskit.com/" className="hover:underline hover:text-blue-500 transition-colors">Home</a></li>
                <li><a href="https://thewebtoolskit.com/privacy-policy" className="hover:underline hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                <li><a href="https://thewebtoolskit.com/" className="hover:underline hover:text-blue-500 transition-colors">Terms of Service</a></li>
                <li><a href="https://thewebtoolskit.com/" className="hover:underline hover:text-blue-500 transition-colors">All Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Related Word Count Tools</h3>
              <ul className={`text-sm space-y-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><a href="https://www.thewebtoolskit.com/keyword-density" className="hover:underline hover:text-blue-500 transition-colors">Keyword Density Checker</a></li>
                <li><a href="https://www.thewebtoolskit.com/char-remover" className="hover:underline hover:text-blue-500 transition-colors">Character Remover Tool</a></li>
                <li><a href="https://www.thewebtoolskit.com/text-cleaner" className="hover:underline hover:text-blue-500 transition-colors">Text Cleaner</a></li>
              </ul>
            </div>
          </div>
          <div className={`pt-6 border-t ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'} text-center text-sm`}>
            <p>© 2026 <a href="https://thewebtoolskit.com/" className="hover:underline hover:text-blue-500 transition-colors font-semibold">The Web Toolskit</a>. All rights reserved. <strong>Free online word counter</strong> for essays, documents, PDF files. The ultimate <strong>word count tool for students</strong> and writers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}