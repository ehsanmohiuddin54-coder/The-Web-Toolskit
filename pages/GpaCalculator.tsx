import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Download, 
  Share2, 
  BarChart,
  Clock,
  GraduationCap,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  School,
  Target,
  Calendar,
  Shield,
  Zap,
  ExternalLink
} from 'lucide-react';
import { ToolNavigation } from '../components/ToolNavigation';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  semester: string;
}

const GRADE_SCALE: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

const GRADE_COLORS: Record<string, string> = {
  'A+': 'bg-green-100 text-green-800 border-green-200',
  'A': 'bg-green-50 text-green-700 border-green-100',
  'A-': 'bg-green-50/70 text-green-600 border-green-50',
  'B+': 'bg-blue-100 text-blue-800 border-blue-200',
  'B': 'bg-blue-50 text-blue-700 border-blue-100',
  'B-': 'bg-blue-50/70 text-blue-600 border-blue-50',
  'C+': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'C': 'bg-yellow-50 text-yellow-700 border-yellow-100',
  'C-': 'bg-yellow-50/70 text-yellow-600 border-yellow-50',
  'D+': 'bg-orange-100 text-orange-800 border-orange-200',
  'D': 'bg-orange-50 text-orange-700 border-orange-100',
  'F': 'bg-red-100 text-red-800 border-red-200',
};

const SEMESTERS = ['Fall 2026', 'Spring 2026', 'Summer 2026', 'Fall 2025', 'Spring 2025'];

export const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: Date.now().toString(), name: 'Introduction to Computer Science', grade: 'A', credits: 3, semester: 'Fall 2026' },
    { id: (Date.now() + 1).toString(), name: 'Calculus I', grade: 'B+', credits: 4, semester: 'Fall 2026' },
    { id: (Date.now() + 2).toString(), name: 'English Composition', grade: 'A-', credits: 3, semester: 'Fall 2026' },
  ]);
  
  const [gpaScale, setGpaScale] = useState<'4.0' | '5.0'>('4.0');
  const [gpaType, setGpaType] = useState<'unweighted' | 'weighted'>('unweighted');
  const [showFAQs, setShowFAQs] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  // This line was incorrectly placed - removed the duplicate declaration
  // const [gradeType, setGradeType] = useState<string>("unweighted");

  const addCourse = () => {
    setCourses([...courses, { 
      id: Date.now().toString(), 
      name: '', 
      grade: 'A', 
      credits: 3,
      semester: SEMESTERS[0]
    }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const clearAll = () => {
    setCourses([{ id: Date.now().toString(), name: '', grade: 'A', credits: 3, semester: SEMESTERS[0] }]);
  };

  const calculateWeightedGrade = (grade: string) => {
    const baseGrade = GRADE_SCALE[grade] || 0;
    if (gpaScale === '5.0' && gpaType === 'weighted') {
      // For weighted 5.0 scale, AP/honors classes typically add 1.0
      return baseGrade + 1.0;
    }
    return baseGrade;
  };

  const stats = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    let semesterGPAs: Record<string, { points: number; credits: number }> = {};
    
    courses.forEach(c => {
      const points = gpaType === 'weighted' ? calculateWeightedGrade(c.grade) : (GRADE_SCALE[c.grade] || 0);
      totalPoints += points * c.credits;
      totalCredits += c.credits;
      
      // Track semester GPA
      if (!semesterGPAs[c.semester]) {
        semesterGPAs[c.semester] = { points: 0, credits: 0 };
      }
      semesterGPAs[c.semester].points += points * c.credits;
      semesterGPAs[c.semester].credits += c.credits;
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(3) : '0.000';
    const semesterAverages = Object.entries(semesterGPAs).map(([semester, data]) => ({
      semester,
      gpa: (data.credits > 0 ? (data.points / data.credits).toFixed(3) : '0.000')
    }));
    
    return { 
      gpa, 
      totalCredits,
      totalPoints: totalPoints.toFixed(2),
      semesterAverages
    };
  }, [courses, gpaScale, gpaType]);

  const getGpaStatus = (gpa: string) => {
    const numGpa = parseFloat(gpa);
    if (numGpa >= 3.5) return { text: 'Excellent - Dean\'s List Level', color: 'text-green-600', bg: 'bg-green-50' };
    if (numGpa >= 3.0) return { text: 'Good - Above Average', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (numGpa >= 2.0) return { text: 'Satisfactory - Passing', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const handleSave = () => {
    const gpaData = {
      courses,
      stats,
      timestamp: new Date().toISOString(),
      scale: gpaScale,
      type: gpaType
    };
    localStorage.setItem('gpa-calculator-data', JSON.stringify(gpaData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleShare = () => {
    const shareText = `I calculated my GPA using The Web Toolskit's free GPA calculator!\n\nOverall GPA: ${stats.gpa}\nTotal Credits: ${stats.totalCredits}\n\nCalculate your GPA for free: https://thewebtoolskit.com/gpa-calculator`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My GPA Calculation',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const gpaReport = `
GPA Calculation Report
Generated: ${new Date().toLocaleString()}
Tool: The Web Toolskit Free GPA Calculator
URL: https://thewebtoolskit.com/gpa-calculator

OVERALL RESULTS:
• Overall GPA: ${stats.gpa}
• Total Credits: ${stats.totalCredits}
• Total Grade Points: ${stats.totalPoints}
• GPA Scale: ${gpaScale} (${gpaType})
• Academic Status: ${getGpaStatus(stats.gpa).text}

COURSE DETAILS:
${courses.map(course => `• ${course.name || 'Unnamed Course'}: ${course.grade} (${course.credits} credits) - Semester: ${course.semester}`).join('\n')}

SEMESTER GPAs:
${stats.semesterAverages.map(s => `• ${s.semester}: ${s.gpa}`).join('\n')}

NOTES:
This report was generated using our free online GPA calculator.
Your data was processed locally in your browser for privacy.
Visit https://thewebtoolskit.com for more free academic tools.
    `;
    
    const file = new Blob([gpaReport], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `gpa-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const popularKeywords = [
    'free gpa calculator',
    'free online gpa calculator',
    'gpa calculator online',
    'online gpa calculator free',
    'gpa calculator tool',
    'easy gpa calculator',
    'simple gpa calculator tool',
    'fast gpa calculator online',
    'calculate gpa online free',
    'gpa calculator for students',
    'gpa calculator for students no signup',
    'college gpa calculator',
    'college gpa calculator 4.0 scale',
    'university gpa calculator',
    'university grade point average calculator',
    'student gpa calculator',
    'academic gpa calculator',
    'grade point average calculator',
    'free grade point average tool',
    'cumulative gpa calculator',
    'cumulative gpa calculator online',
    'instant cumulative gpa checker',
    'semester gpa calculator',
    'semester gpa calculator tool',
    'fast semester grade calculator',
    'gpa calculator by credits',
    'easy gpa calculator by credits',
    'weighted gpa calculator',
    'weighted gpa calculator for high school',
    'unweighted gpa calculator',
    'weighted vs unweighted gpa tool',
    'gpa calculator for 5.0 scale',
    'gpa calculator for assignments',
    'free scholarship gpa calculator',
    'gpa projection tool',
    'letter grade to gpa converter',
    'simple college credit calculator',
    'academic gpa tracker free',
    '4.0 scale calculator',
    '5.0 scale gpa tool',
    'college grade calculator',
    'high school gpa calculator',
    'transcript gpa calculator',
    'course grade calculator',
    'credit hour calculator',
    'grade point system calculator',
    'gpa predictor tool',
    'academic performance tracker'
  ];

  const faqs = [
    {
      question: 'How does this free online GPA calculator work?',
      answer: 'Our GPA calculator allows you to input your courses, grades, and credit hours. It automatically calculates your cumulative GPA using standard 4.0 or 5.0 scales. The tool supports both weighted and unweighted GPA calculations, making it perfect for college, university, and high school students.'
    },
    {
      question: 'What is the difference between weighted and unweighted GPA?',
      answer: 'Unweighted GPA uses a standard 4.0 scale where all courses are treated equally. Weighted GPA (typically on a 5.0 scale) gives extra points for honors, AP, or advanced courses. Our free GPA calculator supports both systems to give you accurate results for college applications and academic planning.'
    },
    {
      question: 'Can I use this GPA calculator for college and university courses?',
      answer: 'Yes! Our college GPA calculator is specifically designed for higher education. It handles semester-based calculations, credit hour systems, and both 4.0 and 5.0 scales. Thousands of university students use our free online GPA calculator each semester to track their academic progress.'
    },
    {
      question: 'How do I calculate my cumulative GPA with this tool?',
      answer: 'Simply add all your courses with their respective grades and credit hours. Our cumulative GPA calculator automatically computes your overall GPA. You can organize courses by semester to also see semester-specific GPAs. The tool is perfect for tracking your academic performance over multiple terms.'
    },
    {
      question: 'Is this GPA calculator really free with no registration?',
      answer: 'Yes! Our free online GPA calculator requires no signup, no email, and no registration. All calculations happen locally in your browser, ensuring complete privacy. You can use all features including weighted/unweighted calculations, semester tracking, and report generation completely free.'
    },
    {
      question: 'Can I save or share my GPA calculations?',
      answer: 'Absolutely! Our GPA calculator includes save, share, and download features. You can save your calculations locally, share results with advisors, or download detailed reports. These features make our tool perfect for scholarship applications, academic planning, and transcript preparation.'
    }
  ];

  const gradeGuide = [
    { range: 'A/A+ (90-100%)', points: '4.0', description: 'Excellent - Outstanding performance' },
    { range: 'A- (87-89%)', points: '3.7', description: 'Very Good - Above average work' },
    { range: 'B+ (84-86%)', points: '3.3', description: 'Good - Solid performance' },
    { range: 'B (80-83%)', points: '3.0', description: 'Above Average - Satisfactory work' },
    { range: 'C+ (77-79%)', points: '2.3', description: 'Average - Acceptable performance' },
    { range: 'C (73-76%)', points: '2.0', description: 'Below Average - Passing but needs improvement' },
    { range: 'D (60-69%)', points: '1.0', description: 'Poor - Minimal passing grade' },
    { range: 'F (Below 60%)', points: '0.0', description: 'Fail - Did not meet requirements' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">ACADEMIC TOOL</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Free Online GPA Calculator Tool
          </h1>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl">
            Calculate your Grade Point Average instantly. Perfect for college, university, and high school students. Supports weighted/unweighted GPA, 4.0/5.0 scales, and semester tracking. No signup required.
          </p>
          <div className="flex flex-wrap gap-2">
            {['100% Free Tool', 'No Registration', 'Instant Results', '4.0 & 5.0 Scales', 'Weighted/Unweighted', 'Semester Tracking', 'Privacy Focused', 'Mobile Friendly'].map((badge, idx) => (
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
        {/* Left Column - Calculator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calculator Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                GPA Calculator Settings
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <School className="w-4 h-4" />
                    GPA Scale System
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGpaScale('4.0')}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${gpaScale === '4.0' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      4.0 Scale
                    </button>
                    <button
                      onClick={() => setGpaScale('5.0')}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${gpaScale === '5.0' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      5.0 Scale
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    GPA Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGpaType('unweighted')}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${gpaType === 'unweighted' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Unweighted
                    </button>
                    <button
                      onClick={() => setGpaType('weighted')}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${gpaType === 'weighted' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Weighted
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Entry Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Entry
                  </h3>
                  <button 
                    onClick={clearAll}
                    className="text-sm px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-left text-sm font-semibold text-slate-700">Course Name</th>
                        <th className="p-4 text-left text-sm font-semibold text-slate-700">Grade</th>
                        <th className="p-4 text-left text-sm font-semibold text-slate-700">Credits</th>
                        <th className="p-4 text-left text-sm font-semibold text-slate-700">Semester</th>
                        <th className="p-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, index) => (
                        <tr key={course.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <input
                              type="text"
                              placeholder="e.g., Introduction to Psychology"
                              value={course.name}
                              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
                            />
                          </td>
                          <td className="p-4">
                            <select
                              value={course.grade}
                              onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm font-bold ${GRADE_COLORS[course.grade]}`}
                            >
                              {Object.keys(GRADE_SCALE).map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={course.credits}
                              onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm text-center font-bold"
                            />
                          </td>
                          <td className="p-4">
                            <select
                              value={course.semester}
                              onChange={(e) => updateCourse(course.id, 'semester', e.target.value)}
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
                            >
                              {SEMESTERS.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => removeCourse(course.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-2"
                              disabled={courses.length <= 1}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button
                  onClick={addCourse}
                  className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-xl hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Another Course</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleSave}
              className="p-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              <div className={`p-2 rounded-lg ${saved ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {saved ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900">
                  {saved ? 'Saved!' : 'Save Calculation'}
                </div>
                <div className="text-xs text-slate-500">Store locally for later</div>
              </div>
            </button>
            
            <button
              onClick={handleShare}
              className="p-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              <div className={`p-2 rounded-lg ${shared ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {shared ? <CheckCircle className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900">
                  {shared ? 'Shared!' : 'Share Results'}
                </div>
                <div className="text-xs text-slate-500">With advisors or friends</div>
              </div>
            </button>
            
            <button
              onClick={handleDownload}
              className="p-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900">Download Report</div>
                <div className="text-xs text-slate-500">For scholarship applications</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column - Results & Analysis */}
        <div className="space-y-6">
          {/* GPA Display */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-100 text-center">
            <div className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-80">CALCULATED GPA</div>
            <div className="text-4xl md:text-5xl font-black mb-3 tracking-tight animate-in zoom-in duration-500"> {stats.gpa}</div>
            <div className="text-blue-100 text-lg font-medium mb-2">Scale: {gpaScale}.0 ({gpaType})</div>
            
            <div className={`mt-6 p-4 rounded-xl ${getGpaStatus(stats.gpa).bg} ${getGpaStatus(stats.gpa).color}`}>
              <div className="font-bold text-lg">{getGpaStatus(stats.gpa).text}</div>
              <div className="text-sm mt-1 opacity-90">Academic Standing</div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 w-full grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-bold uppercase opacity-60">Credits</div>
                <div className="text-2xl font-black mt-2">{stats.totalCredits}</div>
              </div>
              <div>
                <div className="text-sm font-bold uppercase opacity-60">Points</div>
                <div className="text-2xl font-black mt-2">{stats.totalPoints}</div>
              </div>
            </div>
          </div>

          {/* Grade Scale Guide */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Grade Scale Guide
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {gradeGuide.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">{grade.range}</div>
                      <div className="text-xs text-slate-600">{grade.description}</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{grade.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Semester Breakdown */}
          {stats.semesterAverages.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Semester Breakdown
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {stats.semesterAverages.map((semester, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                      <div className="font-medium text-slate-900">{semester.semester}</div>
                      <div className="text-xl font-bold text-blue-600">{semester.gpa}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Why Use Our Free Online GPA Calculator?
          </h2>
          
          <p className="text-lg text-slate-700 mb-6">
            As a student, accurately calculating your <strong>Grade Point Average (GPA)</strong> is essential for tracking academic progress, applying for scholarships, and meeting graduation requirements. Our <strong>free online GPA calculator</strong> provides instant, accurate results for both <strong>college and university students</strong>, supporting <strong>4.0 and 5.0 scales</strong> with <strong>weighted and unweighted</strong> calculations.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Key Features
              </h3>
              <ul className="space-y-3">
                {[
                  '100% Free - No hidden costs or limitations',
                  'No Registration Required - Start instantly',
                  '4.0 & 5.0 Scale Support - For all academic levels',
                  'Weighted/Unweighted Calculations - AP and honors courses',
                  'Semester Tracking - Multiple term support',
                  'Course Management - Add/remove courses easily',
                  'Instant Results - Real-time GPA calculation',
                  'Privacy Focused - All processing happens locally'
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
                <GraduationCap className="w-5 h-5" />
                Academic Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  'Accurate Scholarship Applications',
                  'Better Academic Planning',
                  'Graduation Requirement Tracking',
                  'College Application Preparation',
                  'Academic Progress Monitoring',
                  'Transcript Preparation',
                  'Course Load Optimization',
                  'Goal Setting & Achievement'
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
                Frequently Asked Questions About GPA Calculation
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
            <h3 className="text-lg font-bold text-slate-900 mb-4">Popular GPA Calculator Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.slice(15, 35).map((keyword, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-4">Ready to Calculate Your GPA?</h3>
            <p className="text-blue-100 mb-4">
              Get instant, accurate GPA calculations for free. Perfect for college applications, scholarship submissions, and academic planning. No registration required - start calculating now!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
              >
                Start Calculating GPA
              </button>
              <a
                href="https://thewebtoolskit.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                More Academic Tools
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-4 text-sm text-blue-300">
              Visit <a href="https://thewebtoolskit.com" className="underline hover:text-white">thewebtoolskit.com</a> for more free student tools and resources.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Keywords Footer */}
      <div className="bg-slate-900 text-slate-400 p-6 rounded-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold mb-3">RELATED ACADEMIC KEYWORDS</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularKeywords.slice(25, 45).map((keyword, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-slate-800 rounded hover:text-slate-300 transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-xs mt-4 text-slate-500">
            © {new Date().getFullYear()} The Web Toolskit - Free Online GPA Calculator Tool. All calculations process locally in your browser.
          </p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};