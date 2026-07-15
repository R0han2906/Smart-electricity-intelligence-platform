import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

export default function Card({
  className,
  children,
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/75 shadow-sm shadow-slate-200/50",
        hoverable &&
          "transition-all duration-300 hover:shadow-md hover:border-teal-500/30 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
