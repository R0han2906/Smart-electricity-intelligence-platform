import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import { 
  Zap, ArrowRight, UserPlus, Users, AlertCircle, 
  Leaf, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
  Sun, CheckCircle2, ChevronRight, Activity, CloudRain
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const API_URL = "https://electricity-intelligence-platform-backend.onrender.com/";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Layouts & Components ---

function Button({ 
  className, variant = 'primary', size = 'default', children, ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
  size?: 'default' | 'lg' | 'sm'
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/20 hover:shadow-teal-600/30",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-xl px-8 text-lg",
  };
  
  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

function Card({ className, children, hoverable = false }: { className?: string, children: React.ReactNode, hoverable?: boolean }) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-slate-200/75 shadow-sm shadow-slate-200/50", 
      hoverable && "transition-all duration-300 hover:shadow-md hover:border-teal-500/30 cursor-pointer",
      className
    )}>
      {children}
    </div>
  );
}

// --- Pages ---

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
          <Zap className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 leading-[1.1] pb-2">
          Smart Electricity <br className="hidden md:block"/> Intelligence Platform
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          Monitor consumption, predict future usage, estimate bills, and track your carbon footprint with AI-powered insights.
        </p>
        
        <div className="grid md:grid-cols-2 gap-5 mt-12 max-w-2xl mx-auto">
          <Card hoverable className="group p-1">
            <div 
              className="p-6 h-full flex flex-col items-center text-center space-y-4"
              onClick={() => navigate('/create-user')}
            >
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center group-hover:bg-teal-100 group-hover:scale-110 transition-all duration-300">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 tracking-tight">Create New Profile</h3>
                <p className="text-sm text-slate-500 mt-1">Start tracking your electricity usage from scratch.</p>
              </div>
            </div>
          </Card>
          
          <Card hoverable className="group p-1">
            <div 
              className="p-6 h-full flex flex-col items-center text-center space-y-4"
              onClick={() => navigate('/select-user')}
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 tracking-tight">Select Existing</h3>
                <p className="text-sm text-slate-500 mt-1">Continue with an existing tracking profile.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AddConsumptionPage() {
  const navigate = useNavigate();
  const [months, setMonths] = useState(Array.from({ length: 12 }, (_, i) => ({
    month: `2023-${(i + 1).toString().padStart(2, '0')}`,
    usage: i === 0 ? "120" : i === 1 ? "135" : i === 2 ? "142" : ""
  })));

  const handleUpdate = (index: number, field: string, value: string) => {
    const newMonths = [...months];
    newMonths[index] = { ...newMonths[index], [field]: value };
    setMonths(newMonths);
  };

  const completed = months.filter(m => m.usage && Number(m.usage) > 0).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Historical Consumption</h2>
          <p className="text-slate-500 mt-2 font-medium">Enter your electricity usage for the past 12 months to enable AI predictions.</p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shadow-sm">
                {completed}
              </div>
              <span className="text-sm font-semibold text-slate-600 tracking-tight">of 12 months completed</span>
            </div>
            <div className="h-2.5 flex-1 mx-6 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-700 ease-out relative" 
                style={{ width: `${(completed / 12) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {months.map((item, i) => (
              <div key={i} className="flex gap-4 items-center group">
                <div className="w-8 text-center text-sm font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">{i + 1}</div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input 
                    type="month"
                    value={item.month}
                    onChange={(e) => handleUpdate(i, 'month', e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
                  />
                  <div className="relative">
                    <input 
                      type="number"
                      placeholder="Usage"
                      value={item.usage}
                      onChange={(e) => handleUpdate(i, 'usage', e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-slate-400 text-sm font-medium">kWh</span>
                    </div>
                  </div>
                </div>
                <div className="w-8 flex justify-center">
                  {item.usage && Number(item.usage) > 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-teal-500 drop-shadow-sm transition-all duration-300 scale-in" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 transition-colors" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end pt-6 border-t border-slate-100">
            <Button 
              size="lg" 
              disabled={completed < 12}
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto"
            >
              Generate AI Insights
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Dashboard() {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Next (Pred)'],
    datasets: [
      {
        fill: true,
        label: 'Historical',
        data: [120, 110, 135, 142, 180, 220, 250, 240, 200, 160, 140, 130, null],
        borderColor: '#0d9488', // teal-600
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#0d9488',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        fill: false,
        label: 'Prediction',
        data: [null, null, null, null, null, null, null, null, null, null, null, 130, 125],
        borderColor: '#3b82f6', // blue-500
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <header className="bg-white border-b border-slate-200/75 sticky top-0 z-10 shadow-sm shadow-slate-100/50 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-inner">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">Smart Energy</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-semibold text-slate-600">John Doe</div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200 shadow-sm">
              J
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Energy Forecast</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Overview of your consumption and AI predictions.</p>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-teal-200 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 mr-2 text-teal-600" />
            January 2024
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Activity className="w-16 h-16 text-teal-500" />
            </div>
            <div className="flex items-center justify-between text-slate-500 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">Predicted Usage</span>
              <Activity className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-slate-900 tracking-tighter">125</span>
              <span className="text-sm font-semibold text-slate-500">kWh</span>
            </div>
            <div className="mt-3 flex items-center text-sm font-medium text-teal-600 relative z-10">
              <div className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md flex items-center shadow-sm">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                3.8%
              </div>
              <span className="text-slate-400 ml-2 text-xs">from last month</span>
            </div>
          </Card>
          
          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Zap className="w-16 h-16 text-blue-500" />
            </div>
            <div className="flex items-center justify-between text-slate-500 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">Estimated Bill</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-slate-900 tracking-tighter">₹850</span>
            </div>
            <div className="mt-3 flex items-center text-sm font-medium text-slate-500 relative z-10">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md shadow-sm text-xs">
                Slab: 101-300 units
              </span>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <CloudRain className="w-16 h-16 text-slate-400" />
            </div>
            <div className="flex items-center justify-between text-slate-500 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">Carbon Footprint</span>
              <CloudRain className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-slate-900 tracking-tighter">102</span>
              <span className="text-sm font-semibold text-slate-500">kg CO₂</span>
            </div>
            <div className="mt-3 flex items-center text-sm font-medium text-slate-500 relative z-10">
               <span className="text-xs text-slate-400">Monthly average</span>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-teal-600 to-teal-700 text-white border-none shadow-md shadow-teal-700/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Leaf className="w-24 h-24 text-white" />
            </div>
            <div className="flex items-center justify-between text-teal-100 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">Trees Equivalent</span>
              <Leaf className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-sm">4.8</span>
              <span className="text-sm font-semibold text-teal-100">trees</span>
            </div>
            <div className="mt-3 text-xs font-medium text-teal-100/90 relative z-10">
              Needed to offset emissions this month
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="col-span-2 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="font-bold text-slate-900 tracking-tight">Consumption Trends</h3>
                <p className="text-sm text-slate-500 font-medium">Historical data & next month prediction</p>
              </div>
              <select className="text-sm font-medium border-slate-200 rounded-lg bg-slate-50 focus:ring-teal-500 py-2 pl-3 pr-8 shadow-sm">
                <option>Past 12 Months</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="h-80 w-full relative">
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      titleFont: { size: 13, family: 'Inter', weight: 'bold' },
                      bodyFont: { size: 13, family: 'Inter' },
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: '#f1f5f9', drawTicks: false },
                      border: { display: false },
                      ticks: { font: { family: 'Inter', size: 12 }, color: '#64748b', padding: 8 }
                    },
                    x: {
                      grid: { display: false },
                      border: { display: false },
                      ticks: { font: { family: 'Inter', size: 12 }, color: '#64748b', padding: 8 }
                    }
                  }
                }} 
              />
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 tracking-tight">AI Insights</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide uppercase border border-indigo-100">Live</span>
            </div>
            
            <Card className="p-5 bg-gradient-to-br from-blue-50/80 to-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">Summer Peak Coming</h4>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">Based on historical data, expect a 45% increase in usage over the next 3 months.</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-teal-50/80 to-white border-teal-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0 shadow-sm text-teal-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">Good Job!</h4>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">Your consumption is 12% lower than the same period last year.</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-5 bg-gradient-to-br from-amber-50/80 to-white border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 shadow-sm text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">Slab Warning</h4>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">You are 25 kWh away from moving to a higher billing tariff slab.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SelectUserPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request to "find" the user
    setTimeout(() => {
      navigate('/dashboard');
    }, 800); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center mb-8">
           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Users className="w-6 h-6 text-white" />
           </div>
        </div>
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight text-center">Find Your Profile</h2>
          <p className="text-slate-500 text-center text-sm font-medium mb-8">Enter your details to access your dashboard.</p>
          
          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input required type="text" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input required type="email" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm" placeholder="john@example.com" />
            </div>
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full shadow-md bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30 focus:ring-blue-500/50" 
                size="lg" 
                disabled={isLoading}
              >
                {isLoading ? 'Finding Profile...' : 'Access Dashboard'} 
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

// --- App Root ---

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-user" element={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-teal-100 selection:text-teal-900">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center mb-8">
                 <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
                    <Zap className="w-6 h-6 text-white" />
                 </div>
              </div>
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight text-center">Create Profile</h2>
                <p className="text-slate-500 text-center text-sm font-medium mb-8">Enter your details to start tracking.</p>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input type="text" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all shadow-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input type="email" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all shadow-sm" placeholder="john@example.com" />
                  </div>
                  <Link to="/add-consumption" className="block pt-4">
                    <Button className="w-full shadow-md" size="lg">Continue <ArrowRight className="w-5 h-5 ml-2" /></Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        } />
        <Route path="/select-user" element={<SelectUserPage />} />
        <Route path="/add-consumption" element={<AddConsumptionPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
