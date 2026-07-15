import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { getUsers } from "@/api/client";

export default function SelectUserSection() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const users = await getUsers();
      const matchedUser = users.find(
        (u) =>
          u.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedUser) {
        localStorage.setItem("userId", String(matchedUser.id));
        localStorage.setItem("userName", matchedUser.name);
        navigate("/dashboard");
      } else {
        alert("Profile not found. Please verify your details or create a new profile.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to query profiles.");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight text-center">
            Find Your Profile
          </h2>
          <p className="text-slate-500 text-center text-sm font-medium mb-8">
            Enter your details to access your dashboard.
          </p>

          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
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
                required
                type="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full shadow-md bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30 focus:ring-blue-500/50 text-white"
                size="lg"
                disabled={loading}
              >
                {loading ? "Finding Profile..." : "Access Dashboard"}
                {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
