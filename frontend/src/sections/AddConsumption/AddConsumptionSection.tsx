import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { addConsumption, predictNextMonth } from "@/api/client";

export default function AddConsumptionSection() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [months, setMonths] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      month: `2023-${(i + 1).toString().padStart(2, "0")}`,
      usage: i === 0 ? "120" : i === 1 ? "135" : i === 2 ? "142" : "",
    }))
  );

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (!storedId) {
      alert("No active user profile. Please create a profile first.");
      navigate("/");
    } else {
      setUserId(Number(storedId));
    }
  }, [navigate]);

  const handleUpdate = (index: number, field: string, value: string) => {
    const newMonths = [...months];
    newMonths[index] = { ...newMonths[index], [field]: value };
    setMonths(newMonths);
  };

  const handleSubmit = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // 1. Submit all 12 months sequentially to avoid connection congestion or race conditions
      for (const item of months) {
        if (!item.usage || Number(item.usage) <= 0) {
          throw new Error("All usage values must be greater than 0");
        }
        await addConsumption(userId, item.month, Number(item.usage));
      }

      // 2. Trigger the AI forecast for the next month
      await predictNextMonth(userId);

      // 3. Navigate to the dashboard
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to submit consumption history.");
    } finally {
      setLoading(false);
    }
  };

  const completed = months.filter((m) => m.usage && Number(m.usage) > 0).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Historical Consumption
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Enter your electricity usage for the past 12 months to enable AI
            predictions.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shadow-sm">
                {completed}
              </div>
              <span className="text-sm font-semibold text-slate-600 tracking-tight">
                of 12 months completed
              </span>
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
                <div className="w-8 text-center text-sm font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                  {i + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input
                    type="month"
                    value={item.month}
                    onChange={(e) => handleUpdate(i, "month", e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Usage"
                      value={item.usage}
                      onChange={(e) => handleUpdate(i, "usage", e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-slate-400 text-sm font-medium">
                        kWh
                      </span>
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
              disabled={completed < 12 || loading}
              onClick={handleSubmit}
              className="w-full sm:w-auto"
            >
              {loading ? "Generating Insights..." : "Generate AI Insights"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
