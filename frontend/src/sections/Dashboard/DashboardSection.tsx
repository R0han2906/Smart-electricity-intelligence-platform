import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  AlertCircle,
  Leaf,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sun,
  CheckCircle2,
  Activity,
  CloudRain,
} from "lucide-react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { getDashboardData, DashboardDataResponse } from "@/api/client";

// Register Chart.js components
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

function formatMonthLabel(monthStr: string): string {
  const date = new Date(monthStr);
  if (isNaN(date.getTime())) return monthStr;
  return date.toLocaleString("en-US", { month: "short" });
}

export default function DashboardSection() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (!storedId) {
      alert("No active profile found. Please select or create one.");
      navigate("/");
    } else {
      setUserId(Number(storedId));
      setUserName(storedName || "User");
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDashboardData(userId);
        setData(response);
      } catch (err: any) {
        alert(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Loading AI Insights...</p>
        </div>
      </div>
    );
  }

  const { consumption_history, predictions } = data;
  const histPoints = consumption_history.map((c) => c.actual_kwh);
  const latestPred = predictions[predictions.length - 1];

  // Calculate metrics
  const lastMonthUsage = histPoints[histPoints.length - 1] ?? 0;
  const predictedUsage = latestPred ? latestPred.predicted_kwh : 0;
  const changePct = lastMonthUsage ? ((predictedUsage - lastMonthUsage) / lastMonthUsage) * 100 : 0;
  
  const predictedBill = latestPred ? latestPred.predicted_bill : 0;
  const carbonKg = latestPred ? latestPred.carbon_kg : 0;
  
  // Formulas matching the python backend:
  // INDIA_EMISSION_FACTOR = 0.82
  // TREE_ABSORPTION_YEARLY = 21 (Monthly: 21 / 12 = 1.75)
  // trees = carbon / 1.75
  const treesOffset = carbonKg / 1.75;

  // Determine Slab Detail
  let slabText = "Slab: 101-300 units";
  if (predictedUsage <= 100) {
    slabText = "Slab: 0-100 units";
  } else if (predictedUsage <= 300) {
    slabText = "Slab: 101-300 units";
  } else if (predictedUsage <= 500) {
    slabText = "Slab: 301-500 units";
  } else {
    slabText = "Slab: > 500 units";
  }

  // Dynamic AI Insights generation mirroring the backend service rules
  const aiInsightsList: Array<{ title: string; description: string; type: "summer" | "warning" | "success" | "carbon" }> = [];

  // Summer peak default/seasonal insight
  aiInsightsList.push({
    title: "Summer Peak Coming",
    description: "Based on historical data, expect a 45% increase in usage over the next 3 months.",
    type: "summer",
  });

  // Trend Insight
  if (changePct > 10) {
    aiInsightsList.push({
      title: "Usage Trend Spiked",
      description: `Your projected consumption is ${Math.abs(changePct).toFixed(1)}% higher than last month. Shifting appliance usage (like washing machines or dishwashers) to morning hours can help stabilize peak load.`,
      type: "warning",
    });
  } else if (changePct < -10) {
    aiInsightsList.push({
      title: "Good Job!",
      description: `Your projected consumption is ${Math.abs(changePct).toFixed(1)}% lower than last month. This conservation offset approximately ${Math.round((lastMonthUsage - predictedUsage) * 0.82)} kg of carbon emissions!`,
      type: "success",
    });
  } else {
    aiInsightsList.push({
      title: "Steady Consumption",
      description: `Your consumption is remaining steady compared to last month (${Math.abs(changePct).toFixed(1)}% change). Try unplugging standby devices to reduce phantom loads.`,
      type: "success",
    });
  }

  // Slab Warning
  if (predictedUsage > 500) {
    aiInsightsList.push({
      title: "Slab Warning",
      description: "You are projected to enter the highest electricity tariff slab of ₹11.00/unit. Running ACs at a constant 24°C can help lower high peak bills.",
      type: "warning",
    });
  } else {
    // Calculate distance to next slab
    let unitsToNextSlab = 0;
    let nextRate = 7.00;
    if (predictedUsage <= 100) {
      unitsToNextSlab = 100 - predictedUsage;
      nextRate = 7.00;
    } else if (predictedUsage <= 300) {
      unitsToNextSlab = 300 - predictedUsage;
      nextRate = 9.00;
    } else if (predictedUsage <= 500) {
      unitsToNextSlab = 500 - predictedUsage;
      nextRate = 11.00;
    }
    if (unitsToNextSlab > 0 && unitsToNextSlab < 50) {
      aiInsightsList.push({
        title: "Slab Warning",
        description: `You are only ${unitsToNextSlab.toFixed(1)} kWh away from moving to the higher tariff slab of ₹${nextRate.toFixed(2)}/unit. Save ${unitsToNextSlab.toFixed(1)} kWh to prevent a bill increase.`,
        type: "warning",
      });
    }
  }

  // Carbon Footprint warning (matching backend: carbon > 600)
  if (carbonKg > 600) {
    aiInsightsList.push({
      title: "High Carbon Alert",
      description: `Your carbon footprint of ${Math.round(carbonKg)} kg CO₂ is relatively high. Equivalent to driving ${Math.round(carbonKg / 0.192)} km in a petrol car. Consider supporting renewable energy offsets.`,
      type: "warning",
    });
  }

  // Chart configuration
  const labels = consumption_history.map((c) => formatMonthLabel(c.month)).concat("Next (Pred)");
  const historicalChartData = [...histPoints, null];
  const predictionChartData = [
    ...Array(histPoints.length - 1).fill(null),
    lastMonthUsage,
    predictedUsage,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Historical",
        data: historicalChartData,
        borderColor: "#0d9488", // teal-600
        backgroundColor: "rgba(13, 148, 136, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#0d9488",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        fill: false,
        label: "Prediction",
        data: predictionChartData,
        borderColor: "#3b82f6", // blue-500
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar userName={userName} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Energy Forecast
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Overview of your consumption and AI predictions.
            </p>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-teal-200 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 mr-2 text-teal-600" />
            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Predicted Usage */}
          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16 text-teal-500" />
            </div>
            <div className="flex items-center justify-between text-slate-500 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">
                Predicted Usage
              </span>
              <Activity className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-slate-900 tracking-tighter">
                {predictedUsage ? Math.round(predictedUsage) : "--"}
              </span>
              <span className="text-sm font-semibold text-slate-500">kWh</span>
            </div>
            <div className="mt-3 flex items-center text-sm font-medium text-teal-600 relative z-10">
              <div
                className={`px-2 py-0.5 rounded-md flex items-center shadow-sm ${
                  changePct <= 0 ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-700"
                }`}
              >
                {changePct <= 0 ? (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                )}
                {Math.abs(changePct).toFixed(1)}%
              </div>
              <span className="text-slate-400 ml-2 text-xs">
                from last month
              </span>
            </div>
          </Card>

          {/* Card 2: Estimated Bill */}
          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-16 h-16 text-blue-500" />
            </div>
            <div className="flex items-center justify-between text-slate-500 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">
                Estimated Bill
              </span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-slate-900 tracking-tighter">
                ₹{predictedBill ? Math.round(predictedBill) : "--"}
              </span>
            </div>
            <div className="mt-3 flex items-center text-sm font-medium text-slate-500 relative z-10">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md shadow-sm text-xs">
                {slabText}
              </span>
            </div>
          </Card>

          {/* Card 3: Carbon Footprint */}
          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CloudRain className="w-16 h-16 text-slate-400" />
            </div>
            <div className="flex items-center justify-between text-slate-500 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">
                Carbon Footprint
              </span>
              <CloudRain className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-slate-900 tracking-tighter">
                {carbonKg ? Math.round(carbonKg) : "--"}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                kg CO₂
              </span>
            </div>
            <div className="mt-3 flex items-center text-sm font-medium text-slate-500 relative z-10">
              <span className="text-xs text-slate-400">
                {latestPred ? `≈ Driving ${Math.round(carbonKg / 0.192)} km in a car` : "Monthly average"}
              </span>
            </div>
          </Card>

          {/* Card 4: Trees Equivalent */}
          <Card className="p-6 bg-gradient-to-br from-teal-600 to-teal-700 text-white border-none shadow-md shadow-teal-700/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Leaf className="w-24 h-24 text-white" />
            </div>
            <div className="flex items-center justify-between text-teal-100 mb-4 relative z-10">
              <span className="text-sm font-semibold tracking-tight">
                Trees Equivalent
              </span>
              <Leaf className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2 relative z-10">
              <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-sm">
                {treesOffset ? treesOffset.toFixed(1) : "--"}
              </span>
              <span className="text-sm font-semibold text-teal-100">trees</span>
            </div>
            <div className="mt-3 text-xs font-medium text-teal-100/90 relative z-10">
              Needed to offset emissions this month
            </div>
          </Card>
        </div>

        {/* Charts and Insights Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left/Center Column: Line Chart */}
          <Card className="col-span-2 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="font-bold text-slate-900 tracking-tight">
                  Consumption Trends
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Historical data & next month prediction
                </p>
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
                    mode: "index",
                    intersect: false,
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      titleFont: { size: 13, family: "Inter", weight: "bold" },
                      bodyFont: { size: 13, family: "Inter" },
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "#f1f5f9", drawTicks: false },
                      border: { display: false },
                      ticks: {
                        font: { family: "Inter", size: 12 },
                        color: "#64748b",
                        padding: 8,
                      },
                    },
                    x: {
                      grid: { display: false },
                      border: { display: false },
                      ticks: {
                        font: { family: "Inter", size: 12 },
                        color: "#64748b",
                        padding: 8,
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>

          {/* Right Column: AI Insights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 tracking-tight">
                AI Insights
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide uppercase border border-indigo-100">
                Live
              </span>
            </div>

            {aiInsightsList.map((insight, idx) => {
              if (insight.type === "summer") {
                return (
                  <Card
                    key={idx}
                    className="p-5 bg-gradient-to-br from-blue-50/80 to-white border-blue-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              } else if (insight.type === "success") {
                return (
                  <Card
                    key={idx}
                    className="p-5 bg-gradient-to-br from-teal-50/80 to-white border-teal-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0 shadow-sm text-teal-600">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              } else {
                return (
                  <Card
                    key={idx}
                    className="p-5 bg-gradient-to-br from-amber-50/80 to-white border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 shadow-sm text-amber-600">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              }
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
