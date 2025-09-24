import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  } else {
    return undefined;
  }
}

export const dateStrToDateFormat = (dateStr: string) => {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  } else {
    return undefined;
  }
}

export const isValidDate = (dateStr: string) => {
  const dateObj = new Date(dateStr)
  return !isNaN(dateObj.getTime())
}

export const maskOnlyNumber = (value: string) => {
  const onlyDigits = value.replace(/\D/g, "")
  return onlyDigits
}
