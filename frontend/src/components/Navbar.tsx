import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName }: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200/75 sticky top-0 z-10 shadow-sm shadow-slate-100/50 backdrop-blur-xl bg-white/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-inner">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            Smart Energy
          </span>
        </Link>
        {userName && (
          <div className="flex items-center space-x-4">
            <div className="text-sm font-semibold text-slate-600">{userName}</div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200 shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
