// React
import { useNavigate } from "react-router-dom";

// Third-party
import { Zap } from "lucide-react";
// Internal constants
import { LANDING_OPTIONS } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
// Components
import LandingOptionCard from "../../components/landing/LandingOptionCard";



export const LandingSection = () =>{
     const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
          <Zap className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 leading-[1.1] pb-2">
          Smart Electricity <br className="hidden md:block" /> Intelligence
          Platform
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          Monitor consumption, predict future usage, estimate bills, and track
          your carbon footprint with AI-powered insights.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-12 max-w-2xl mx-auto">
  {LANDING_OPTIONS.map((option) => (
    <LandingOptionCard
      key={option.path}
      {...option}
      onClick={() => navigate(option.path)}
    />
  ))}
</div>
      </div>
    </div>
  );

}

