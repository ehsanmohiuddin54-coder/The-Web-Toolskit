import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import WordCounter from "./pages/WordCounter";
import { CaseConverter } from './pages/CaseConverter';
import { TextCleaner } from './pages/TextCleaner';
import { KeywordDensity } from './pages/KeywordDensity';
import { MetaGenerator } from './pages/MetaGenerator';
import { JsonFormatter } from './pages/JsonFormatter';
import { SpecialCharacterRemover } from './pages/SpecialCharacterRemover';
import { GpaCalculator } from './pages/GpaCalculator';
import   PDFEditor  from './pages/PDFEditor'; // Fixed: Use correct component name
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { BlogList } from './pages/BlogList';
import { BlogPostView } from './pages/BlogPostView';
import { BlogAdmin } from './pages/BlogAdmin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { getSettings } from './utils/settings-store';

export const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/word-counter', label: 'Word Counter', icon: '🔢' },
  { path: '/case-converter', label: 'Case Converter', icon: '🔠' },
  { path: '/text-cleaner', label: 'Text Cleaner', icon: '🧹' },
  { path: '/keyword-density', label: 'Keyword Density', icon: '📊' },
  { path: '/meta-generator', label: 'Meta Generator', icon: '🏷️' },
  { path: '/json-formatter', label: 'JSON Formatter', icon: '📦' },
  { path: '/char-remover', label: 'Char Remover', icon: '🚫' },
  { path: '/gpa-calculator', label: 'GPA Calculator', icon: '🎓' },
  { path: 'PDFEditor', label: 'PDF Editor', icon: '📄' }, // Fixed: Correct path
  { path: '/blog', label: 'Blog', icon: '✍️' },
];

const App: React.FC = () => {
  const [enabledTools, setEnabledTools] = useState<string[]>([]);

  useEffect(() => {
    const settings = getSettings();
    setEnabledTools(settings.enabledTools);
    
    // Listen for changes
    const handleStorage = () => setEnabledTools(getSettings().enabledTools);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/word-counter" element={enabledTools.includes('/word-counter') ? <WordCounter /> : <Home />} />
          <Route path="/case-converter" element={enabledTools.includes('/case-converter') ? <CaseConverter /> : <Home />} />
          <Route path="/text-cleaner" element={enabledTools.includes('/text-cleaner') ? <TextCleaner /> : <Home />} />
          <Route path="/keyword-density" element={enabledTools.includes('/keyword-density') ? <KeywordDensity /> : <Home />} />
          <Route path="/meta-generator" element={enabledTools.includes('/meta-generator') ? <MetaGenerator /> : <Home />} />
          <Route path="/json-formatter" element={enabledTools.includes('/json-formatter') ? <JsonFormatter /> : <Home />} />
          <Route path="/char-remover" element={enabledTools.includes('/char-remover') ? <SpecialCharacterRemover /> : <Home />} />
          <Route path="/gpa-calculator" element={enabledTools.includes('/gpa-calculator') ? <GpaCalculator /> : <Home />} />
          <Route path="/pdf-editor" element={enabledTools.includes('/pdf-editor') ? <PDFEditor /> : <Home />} /> {/* Fixed: Use correct component */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostView />} />
          
          <Route path="/blog-admin" element={
            <ProtectedRoute requireAdmin>
              <BlogAdmin />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;