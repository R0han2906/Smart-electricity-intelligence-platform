import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "lg" | "sm";
}

export default function Button({
  className,
  variant = "primary",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/20 hover:shadow-teal-600/30",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
      "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-xl px-8 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
