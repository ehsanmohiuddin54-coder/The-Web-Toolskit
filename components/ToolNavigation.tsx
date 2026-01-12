
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../App';

export const ToolNavigation: React.FC = () => {
  const location = useLocation();
  const currentIndex = navItems.findIndex(item => item.path === location.pathname);

  // Exclude dashboard (index 0) from standard cycling if needed, or include it
  const prevItem = currentIndex > 0 ? navItems[currentIndex - 1] : navItems[navItems.length - 1];
  const nextItem = currentIndex < navItems.length - 1 ? navItems[currentIndex + 1] : navItems[0];

  return (
    <div className="flex items-center justify-between pt-8 mt-12 border-t border-slate-200">
      <Link
        to={prevItem.path}
        className="group flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition-colors"
      >
        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
          ←
        </div>
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Previous Tool</div>
          <div className="text-sm font-semibold">{prevItem.label}</div>
        </div>
      </Link>

      <Link
        to={nextItem.path}
        className="group flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition-colors text-right"
      >
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Next Tool</div>
          <div className="text-sm font-semibold">{nextItem.label}</div>
        </div>
        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
          →
        </div>
      </Link>
    </div>
  );
};
