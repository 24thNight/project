import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getProgressColor(progress: number): string {
  if (progress < 30) return "bg-red-500";
  if (progress < 70) return "bg-yellow-500";
  return "bg-green-500";
}

// Add these utility functions for development-only logging
export const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, ...args);
  }
};

export const devError = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, ...args);
  }
};

export const devWarn = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(message, ...args);
  }
}; 