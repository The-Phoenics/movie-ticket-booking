import type { CURRENCY } from "@movie-ticket-booking/shared/types";

export function apiJsonResponse<T = unknown>(
  success: boolean,
  data: T | null = null,
  message: string = "",
  errors: unknown | null = null,
) {
  return {
    success,
    message,
    data,
    errors,
  };
}

export function isValidDateInstance(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function minutesToSeconds(timeInMinutes: number) {
  return timeInMinutes * 60;
}

export function convertIntoSmallestCurrencyUnit(amount: number, currency: CURRENCY) {
  let convertedValue = 0;
  switch (currency) {
    // case "USD":
    //   convertedValue = amount * 100;
    //   break;
    case "INR":
      convertedValue = amount * 100;
      break;
    default:
      convertedValue = amount;
  }
  return convertedValue;
}
