import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { createUser } from "@/api/client";

export default function CreateUserSection() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await createUser(name, email);
      localStorage.setItem("userId", String(data.id));
      localStorage.setItem("userName", data.name);
      navigate("/add-consumption");
    } catch (err: any) {
      alert(err.message || "Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight text-center">
            Create Profile
          </h2>
          <p className="text-slate-500 text-center text-sm font-medium mb-8">
            Enter your details to start tracking.
          </p>

          <form onSubmit={handleCreateUser} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all shadow-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all shadow-sm"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating..." : "Continue"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
