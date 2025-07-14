import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detects the user's timezone automatically using the browser's Intl API
 * Falls back to UTC if detection fails
 */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn("Could not auto-detect timezone:", error);
    return "UTC";
  }
}

/**
 * Formats a timezone name for display (e.g., "America/New_York" -> "Eastern Time")
 */
export function formatTimezone(timezone: string): string {
  try {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      timeZoneName: "long",
    };
    return (
      new Intl.DateTimeFormat("en-US", options)
        .formatToParts(date)
        .find((part) => part.type === "timeZoneName")?.value || timezone
    );
  } catch {
    return timezone;
  }
}
