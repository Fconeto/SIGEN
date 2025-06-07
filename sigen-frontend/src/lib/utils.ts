import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { APP_WEB_PUBLIC_URL } from "./const";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function baseUrlNormalized(path?: string) {
  const baseUrl = APP_WEB_PUBLIC_URL || "";
  const normalizedPath = path && !path.startsWith("/")
    ? `/${path}`
    : path || "";
  return `${baseUrl}${normalizedPath}`;
}