
import React, { useState, useMemo } from 'react';
import { ToolNavigation } from '../components/ToolNavigation';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
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

export const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: 'A', credits: 3 },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', grade: 'A', credits: 3 }]);
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
    setCourses([{ id: Date.now().toString(), name: '', grade: 'A', credits: 3 }]);
  };

  const stats = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      const points = GRADE_SCALE[c.grade] || 0;
      totalPoints += points * c.credits;
      totalCredits += c.credits;
    });
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    return { gpa, totalCredits };
  }, [courses]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Course Entry */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Semester Courses</h3>
              <button 
                onClick={clearAll}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Clear All
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {courses.map((course, index) => (
                <div key={course.id} className="grid grid-cols-12 gap-3 items-center group animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="col-span-6 md:col-span-7">
                    <input 
                      type="text"
                      placeholder="Course Name (Optional)"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <select 
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-bold text-slate-700"
                    >
                      {Object.keys(GRADE_SCALE).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <input 
                      type="number"
                      min="0"
                      max="10"
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-center font-bold"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeCourse(course.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                      title="Remove row"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/30">
              <button 
                onClick={addCourse}
                className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span>Add Another Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-100 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-80">Calculated GPA</div>
            <div className="text-8xl font-black mb-4 tracking-tighter animate-in zoom-in duration-500">{stats.gpa}</div>
            <div className="text-blue-100 font-medium">Total Credits: {stats.totalCredits}</div>
            
            <div className="mt-8 pt-8 border-t border-white/10 w-full grid grid-cols-2 gap-4">
               <div>
                  <div className="text-[10px] font-bold uppercase opacity-60">Status</div>
                  <div className="text-sm font-bold">{parseFloat(stats.gpa) >= 3.0 ? 'Honors' : 'Passing'}</div>
               </div>
               <div>
                  <div className="text-[10px] font-bold uppercase opacity-60">Scale</div>
                  <div className="text-sm font-bold">4.0 Max</div>
               </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4">Grade Point Guide</h4>
             <div className="space-y-2">
                {[
                  { g: 'A/A+', p: '4.0' },
                  { g: 'A-', p: '3.7' },
                  { g: 'B+', p: '3.3' },
                  { g: 'B', p: '3.0' },
                  { g: 'C', p: '2.0' },
                  { g: 'F', p: '0.0' },
                ].map(item => (
                  <div key={item.g} className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Grade {item.g}</span>
                    <span className="text-slate-900 font-bold">{item.p} pts</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 text-amber-900 flex items-start space-x-4">
         <span className="text-2xl">🎓</span>
         <div>
            <h4 className="font-bold mb-1">How is GPA calculated?</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Your GPA is determined by dividing the total number of grade points earned by the total number of credit hours attempted. Each letter grade is assigned a numerical value (e.g., A=4.0, B=3.0). We multiply this value by the course credits, sum them up, and divide by total credits.
            </p>
         </div>
      </div>

      <ToolNavigation />
    </div>
  );
};
